const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

// Set experience + user IDs for nested routes
// POST /experiences/:experienceId/reviews
// Body may not contain experience/user raw fields, so we fill them in
exports.setExperienceUserIds = (req, res, next) => {
  if (!req.body.experience) req.body.experience = req.params.experienceId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
