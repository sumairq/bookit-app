const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: Number,
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
tourSchema.pre('find', function (next) {
  // here the this keyword will refer to the current query and not the current document
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
