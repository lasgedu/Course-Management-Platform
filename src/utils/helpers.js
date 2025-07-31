const crypto = require('crypto');

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateWeekNumber = (startDate, currentDate = new Date()) => {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diffTime = Math.abs(current - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

const isDeadlinePassed = (deadline) => {
  return new Date() > new Date(deadline);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const paginate = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  
  return { limit, offset };
};

module.exports = {
  generateRandomString,
  formatDate,
  calculateWeekNumber,
  isDeadlinePassed,
  sanitizeInput,
  paginate
};