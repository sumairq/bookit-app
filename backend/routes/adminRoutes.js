const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'lead-guide'));

router.get('/stats/overview', adminController.getOverviewStats);
router.get('/stats/by-category', adminController.getExperiencesByCategory);
router.get('/stats/popular', adminController.getPopularExperiences);
router.get('/stats/bookings-trend', adminController.getBookingsTrend);

router.get('/guides', adminController.getGuides);
router.get('/guides/:id', adminController.getGuideById);

router.get('/users', adminController.getUsers);
router.get('/bookings', adminController.getBookings);
router.get('/experiences', adminController.getExperiences);

router.patch(
  '/users/:id/promote',
  authController.restrictTo('admin'),
  adminController.promoteGuide
);

module.exports = router;
