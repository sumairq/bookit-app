const express = require('express');
const experienceController = require('../controllers/experienceController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested route: /experiences/:experienceId/reviews
router.use('/:experienceId/reviews', reviewRouter);

// Top 5 cheap (renamed alias)
router
  .route('/top-5-cheap')
  .get(
    experienceController.aliasTopExperiences,
    experienceController.getAllExperiences
  );

// Experience stats
router.route('/experience-stats').get(experienceController.getExperienceStats);

// Monthly availability plan
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    experienceController.getMonthlyPlan
  );

// Geospatial queries
router
  .route('/experiences-within/:distance/center/:latlng/unit/:unit')
  .get(experienceController.getExperiencesWithin);

// distances/:latlng/unit/:unit
router
  .route('/distances/:latlng/unit/:unit')
  .get(experienceController.getDistances);

// Main collection route
router
  .route('/')
  .get(experienceController.getAllExperiences)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    experienceController.createExperience
  );

// Get by slug
router.route('/slug/:slug').get(experienceController.getExperienceBySlug);

// Resource route by ID
router
  .route('/:id')
  .get(experienceController.getExperience)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    experienceController.uploadExperienceImages,
    experienceController.resizeExperienceImages,
    experienceController.updateExperience
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    experienceController.deleteExperience
  );

module.exports = router;
