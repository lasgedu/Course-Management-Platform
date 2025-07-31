const { body, param, query } = require('express-validator');
const constants = require('./constants');

const validateId = param('id').isInt().withMessage('ID must be an integer');

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

const validateDateRange = [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
];

const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Must be a valid email address');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

const validateRole = body('role')
  .optional()
  .isIn(Object.values(constants.USER_ROLES))
  .withMessage('Invalid role');

module.exports = {
  validateId,
  validatePagination,
  validateDateRange,
  validateEmail,
  validatePassword,
  validateRole
};