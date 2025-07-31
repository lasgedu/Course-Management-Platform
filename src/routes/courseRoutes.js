const express = require('express');
const { body, query } = require('express-validator');
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const courseOfferingValidation = [
  body('moduleId').isInt(),
  body('cohortId').isInt(),
  body('classId').isInt(),
  body('facilitatorId').isInt(),
  body('modeId').isInt(),
  body('trimester').isIn(['T1', 'T2', 'T3']),
  body('intakePeriod').isIn(['HT1', 'HT2', 'FT']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601()
];

const moduleValidation = [
  body('code').notEmpty().trim(),
  body('title').notEmpty().trim(),
  body('credits').isInt({ min: 1, max: 6 })
];

const cohortValidation = [
  body('name').notEmpty().trim(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601()
];

// Course Offering Routes
router.get('/offerings', authenticate, courseController.getCourseOfferings);
router.get('/offerings/:id', authenticate, courseController.getCourseOfferingById);
router.post(
  '/offerings',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  validate(courseOfferingValidation),
  courseController.createCourseOffering
);
router.put(
  '/offerings/:id',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  courseController.updateCourseOffering
);
router.delete(
  '/offerings/:id',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  courseController.deleteCourseOffering
);

// Module Routes
router.get('/modules', authenticate, courseController.getModules);
router.post(
  '/modules',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  validate(moduleValidation),
  courseController.createModule
);

// Cohort Routes
router.get('/cohorts', authenticate, courseController.getCohorts);
router.post(
  '/cohorts',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  validate(cohortValidation),
  courseController.createCohort
);

module.exports = router;