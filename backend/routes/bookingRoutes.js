const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// User must be logged in for any booking routes
router.use(authController.protect);

// PUBLIC (to logged-in users): Stripe checkout session
router.get(
  '/checkout-session/:experienceId',
  bookingController.getCheckoutSession
);

// Only admins or lead-hosts/guides can manage bookings
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
