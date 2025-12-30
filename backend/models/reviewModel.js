const mongoose = require('mongoose');
const Experience = require('./experienceModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // RENAMED: tour → experience
    experience: {
      type: mongoose.Schema.ObjectId,
      ref: 'Experience',
      required: [true, 'Review must belong to an experience.'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate reviews: one user per experience
reviewSchema.index({ experience: 1, user: 1 }, { unique: true });

// Auto-populate user details
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// STATIC METHOD: calculate avg ratings + quantity
reviewSchema.statics.calcAverageRatings = async function (experienceId) {
  const stats = await this.aggregate([
    {
      $match: { experience: experienceId },
    },
    {
      $group: {
        _id: '$experience',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Experience.findByIdAndUpdate(experienceId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Experience.findByIdAndUpdate(experienceId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// After saving a review
reviewSchema.post('save', function () {
  // this points to the current review
  this.constructor.calcAverageRatings(this.experience);
});

// Before findOneAndUpdate or findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

// After findOneAndUpdate/Delete
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.experience);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST /tour/234sdl324/reviews
// GET /tour/234sdl234/reviews
// GET /tour/234sdl234/reviews/902384098fda
