const express = require('express');
const { body, query, param } = require('express-validator');
const activityController = require('../controllers/activityController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const activityLogValidation = [
  body('courseOfferingId').isInt(),
  body('weekNumber').isInt({ min: 1, max: 16 }),
  body('attendance').optional().isArray(),
  body('formativeOneGrading').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('formativeTwoGrading').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('summativeGrading').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('courseModeration').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('intranetSync').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('gradeBookStatus').optional().isIn(['DONE', 'PENDING', 'NOT_STARTED']),
  body('notes').optional().trim()
];

// Routes
router.get('/logs', authenticate, activityController.getActivityLogs);
router.get('/logs/:id', authenticate, activityController.getActivityLogById);
router.post(
  '/logs',
  authenticate,
  authorize('FACILITATOR'),
  validate(activityLogValidation),
  activityController.createActivityLog
);
router.put(
  '/logs/:id',
  authenticate,
  authorize('FACILITATOR'),
  activityController.updateActivityLog
);
router.delete(
  '/logs/:id',
  authenticate,
  authorize('FACILITATOR', 'MANAGER', 'ADMIN'),
  activityController.deleteActivityLog
);

// Summary route for managers
router.get(
  '/summary',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  activityController.getActivitySummary
);

module.exports = router;