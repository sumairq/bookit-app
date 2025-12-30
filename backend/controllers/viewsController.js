const Experience = require('../models/experienceModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/*******************************
 * OVERVIEW PAGE
 *******************************/
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get experience data from collection
  const experiences = await Experience.find();

  // 2) Render the overview template
  res.status(200).render('overview', {
    title: 'All Experiences',
    experiences,
  });
});

/*******************************
 * SINGLE EXPERIENCE DETAIL PAGE
 *******************************/
exports.getExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findOne({
    slug: req.params.slug,
  }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!experience) {
    return next(new AppError('There is no experience with that name.', 404));
  }

  res.status(200).render('experience', {
    title: `${experience.name} Experience`,
    experience,
  });
});

/*******************************
 * LOGIN PAGE
 *******************************/
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create a new account',
  });
};

/*******************************
 * ACCOUNT SETTINGS PAGE
 *******************************/
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

/*******************************
 * LIST USER'S BOOKED EXPERIENCES
 *******************************/
exports.getMyExperiences = catchAsync(async (req, res, next) => {
  // 1) Find all bookings for this user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Extract experience IDs
  const experienceIDs = bookings.map((b) => b.experience);

  // 3) Query experiences using those IDs
  const experiences = await Experience.find({ _id: { $in: experienceIDs } });

  // 4) Render overview with the user's experiences
  res.status(200).render('overview', {
    title: 'My Experiences',
    experiences,
  });
});

/*******************************
 * ACCOUNT FORM SUBMISSION
 *******************************/
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
