const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Experience = require('../models/experienceModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked experience
  const experience = await Experience.findById(req.params.experienceId);

  if (!experience) {
    return next(new AppError('No experience found with that ID', 404));
  }

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-experiences/?experience=${req.params.experienceId}&user=${
      req.user.id
    }&price=${experience.price}`,

    cancel_url: `${req.protocol}://${req.get('host')}/experience/${
      experience.slug
    }`,

    customer_email: req.user.email,
    client_reference_id: req.params.experienceId,

    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: experience.price * 100,
          product_data: {
            name: `${experience.name} Experience`,
            description: experience.summary,
            images: [
              `https://www.natours.dev/img/tours/${experience.imageCover}`,
            ],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

// TEMPORARY + INSECURE booking creation via success redirect
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { experience, user, price } = req.query;

  // Only proceed if all query params exist
  if (!experience || !user || !price) return next();

  await Booking.create({ experience, user, price });

  // Redirect to clean URL (remove query string)
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
