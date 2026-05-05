const Experience = require('../models/experienceModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const CATEGORIES = ['art', 'fitness', 'outdoors', 'food', 'craft', 'tech'];

exports.getOverviewStats = catchAsync(async (req, res) => {
  const [
    totalExperiences,
    totalBookings,
    totalUsers,
    totalGuides,
    totalLeadGuides,
    revenueAgg,
  ] = await Promise.all([
    Experience.countDocuments({ secretExperience: false }),
    Booking.countDocuments(),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'guide' }),
    User.countDocuments({ role: 'lead-guide' }),
    Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalExperiences,
      totalCategories: CATEGORIES.length,
      totalBookings,
      totalUsers,
      totalGuides: totalGuides + totalLeadGuides,
      guidesByRole: { guide: totalGuides, leadGuide: totalLeadGuides },
      totalRevenue: revenueAgg[0]?.total ?? 0,
    },
  });
});

exports.getExperiencesByCategory = catchAsync(async (req, res) => {
  const grouped = await Experience.aggregate([
    { $match: { secretExperience: false } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
      },
    },
  ]);

  const byCategory = Object.fromEntries(
    grouped.map((g) => [g._id, g])
  );

  const distribution = CATEGORIES.map((category) => ({
    category,
    count: byCategory[category]?.count ?? 0,
    avgPrice: byCategory[category]?.avgPrice ?? 0,
    avgRating: byCategory[category]?.avgRating ?? 0,
  }));

  res.status(200).json({
    status: 'success',
    data: { distribution },
  });
});

exports.getPopularExperiences = catchAsync(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const popular = await Booking.aggregate([
    {
      $group: {
        _id: '$experience',
        bookings: { $sum: 1 },
        revenue: { $sum: '$price' },
      },
    },
    { $sort: { bookings: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'experiences',
        localField: '_id',
        foreignField: '_id',
        as: 'experience',
      },
    },
    { $unwind: '$experience' },
    {
      $project: {
        _id: '$experience._id',
        name: '$experience.name',
        slug: '$experience.slug',
        category: '$experience.category',
        price: '$experience.price',
        imageCover: '$experience.imageCover',
        ratingsAverage: '$experience.ratingsAverage',
        bookings: 1,
        revenue: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { popular },
  });
});

exports.getBookingsTrend = catchAsync(async (req, res) => {
  const months = Math.min(parseInt(req.query.months, 10) || 12, 36);
  const since = new Date();
  since.setMonth(since.getMonth() - months);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const trend = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: '$price' },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        bookings: 1,
        revenue: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: { trend },
  });
});

exports.getGuides = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const roleFilter = {
    active: { $ne: false },
    ...(req.query.role
      ? { role: req.query.role }
      : { role: { $in: ['guide', 'lead-guide'] } }),
  };

  const [guides, total] = await Promise.all([
    User.aggregate([
      { $match: roleFilter },
      {
        $lookup: {
          from: 'experiences',
          localField: '_id',
          foreignField: 'hosts',
          as: 'experiences',
        },
      },
      {
        $lookup: {
          from: 'bookings',
          localField: 'experiences._id',
          foreignField: 'experience',
          as: 'bookings',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          photo: 1,
          experienceCount: { $size: '$experiences' },
          bookingCount: { $size: '$bookings' },
          revenue: { $sum: '$bookings.price' },
          avgRating: { $avg: '$experiences.ratingsAverage' },
        },
      },
      { $sort: { bookingCount: -1, name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]),
    User.countDocuments(roleFilter),
  ]);

  res.status(200).json({
    status: 'success',
    results: guides.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: { guides },
  });
});

exports.getGuideById = catchAsync(async (req, res, next) => {
  const guide = await User.findOne({
    _id: req.params.id,
    role: { $in: ['guide', 'lead-guide'] },
  });

  if (!guide) {
    return next(new AppError('No guide found with that ID', 404));
  }

  const experiences = await Experience.find({ hosts: guide._id });
  const experienceIds = experiences.map((e) => e._id);

  const [bookingAgg] = await Booking.aggregate([
    { $match: { experience: { $in: experienceIds } } },
    {
      $group: {
        _id: null,
        bookingCount: { $sum: 1 },
        revenue: { $sum: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      guide,
      experiences,
      metrics: {
        experienceCount: experiences.length,
        bookingCount: bookingAgg?.bookingCount ?? 0,
        revenue: bookingAgg?.revenue ?? 0,
        avgRating:
          experiences.length === 0
            ? 0
            : experiences.reduce((sum, e) => sum + e.ratingsAverage, 0) /
              experiences.length,
      },
    },
  });
});

exports.getExperiences = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.name = new RegExp(req.query.search, 'i');
  }

  const [experiences, total] = await Promise.all([
    Experience.find(filter)
      .select(
        'name slug category duration capacity price priceDiscount ratingsAverage ratingsQuantity summary description imageCover'
      )
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Experience.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    results: experiences.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: { experiences },
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const rx = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('name email role photo')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: { users },
  });
});

exports.getBookings = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    data: { bookings },
  });
});

exports.promoteGuide = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  if (user.role !== 'guide') {
    return next(
      new AppError(
        `Only users with role "guide" can be promoted. Current role: "${user.role}".`,
        400
      )
    );
  }

  user.role = 'lead-guide';
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
