const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal to 40 characters'],
      minLength: [10, 'A tour name must have more or equal to 40 characters'],
      // the isApha is not really useful  in this case as it only accepts letters without any spaces in between (vid-109)
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [1, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW document creation (vid-109)
          // validator npm package is also useful when you want prebuilt custom validators
          //https://github.com/validatorjs/validator.js/
          return value < this.price; // 250 < 200
        },
        // {VALUE} is unique to mongo db and it has nothing to do with javascript
        message: 'Discount price ({VALUE}) should be below the regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description/summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    // using select we can ensure that this field will never be sent to the client.
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  // Improved the number to ensure it rounds off the extra decimal places
  return Number((this.duration / 7).toPrecision(2));
});

//DOCUMENT MIDDLEWARE: runs before the save() command and create() command
// Note: insertMany() or findOneAndUpdate() or findByIdAndUpdate() will not trigger the save middleware
// For the same hook we can have multiple pre and post middlewares . 'save' is a hook for example
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save the document...');
//   next();
// });

// // Runs after saving the document , instead of this keyword we will have access to the saved document
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// We are using the regex /^find/ so that our middleware catches all cases of find, findOneAndDelete, findOneAndUpdate etc
tourSchema.pre(/^find/, function (next) {
  // here the this keyword will refer to the current query and not the current document
  this.find({ secretTour: { $eq: false } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // in the course we use {$ne: false} because we don't do any data migration to update the old data in the course
  this.pipeline().unshift({ $match: { secretTour: { $eq: false } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
