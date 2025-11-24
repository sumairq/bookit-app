const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();

// router.param('id', tourController.checkID);

//POST /tour/234234ad4/reviews
//POST /tour/234234ad4/reviews
//POST /tour/234234ad4/reviews/923423dfda

// We are basically saying whenever you see a route like this use reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopFiveTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
// Add it to the post handler stack

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
