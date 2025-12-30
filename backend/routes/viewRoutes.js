const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// OVERVIEW (ALL EXPERIENCES)
router.get('/', authController.isLoggedIn, viewsController.getOverview);

// EXPERIENCE DETAIL PAGE
router.get(
  '/experience/:slug',
  authController.isLoggedIn,
  viewsController.getExperience
);

// LOGIN PAGE
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

// SIGNUP PAGE
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);

// ACCOUNT PAGE
router.get('/me', authController.protect, viewsController.getAccount);

// MY EXPERIENCES (AFTER STRIPE REDIRECT)
router.get(
  '/my-experiences',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyExperiences
);

// UPDATE USER DATA
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
