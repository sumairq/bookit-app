const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const experienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An experience must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'An experience name must have less or equal to 40 characters',
      ],
      minLength: [
        10,
        'An experience name must have more or equal to 10 characters',
      ],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'An experience must have a duration'],
    },

    // renamed maxGroupSize → capacity
    capacity: {
      type: Number,
      required: [true, 'An experience must have a capacity'],
    },

    // renamed difficulty → category
    category: {
      type: String,
      required: [true, 'An experience must have a category'],
      enum: {
        values: ['art', 'fitness', 'outdoors', 'food', 'craft', 'tech'],
        message:
          'Category must be one of: art, fitness, outdoors, food, craft, tech',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: { type: Number, default: 0 },

    price: {
      type: Number,
      required: [true, 'An experience must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price.',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'An experience must have a summary'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'An experience must have a cover image'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    // renamed startDates → timeSlots
    timeSlots: [Date],

    secretExperience: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // renamed guides → hosts
    hosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEXES
experienceSchema.index({ price: 1, ratingsAverage: -1 });
experienceSchema.index({ slug: 1 });
experienceSchema.index({ startLocation: '2dsphere' });

// VIRTUALS
experienceSchema.virtual('durationWeeks').get(function () {
  return Number((this.duration / 7).toPrecision(2));
});

// IMPORTANT: virtual populate
experienceSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'experience', // must match Review model
  localField: '_id',
});

// DOCUMENT MIDDLEWARE
experienceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
experienceSchema.pre(/^find/, function (next) {
  this.find({ secretExperience: { $eq: false } });
  this.start = Date.now();
  next();
});

experienceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'hosts',
    select: '-__v -passwordChangedAt',
  });
  next();
});

experienceSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

// AGGREGATION MIDDLEWARE (optional)
// experienceSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretExperience: { $eq: false } } });
//   next();
// });

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
