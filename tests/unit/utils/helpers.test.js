const helpers = require('../../../src/utils/helpers');

describe('Helper Functions', () => {
  describe('generateRandomString', () => {
    it('should generate random string of specified length', () => {
      const string1 = helpers.generateRandomString(16);
      const string2 = helpers.generateRandomString(16);

      expect(string1).toHaveLength(32); // Hex encoding doubles length
      expect(string2).toHaveLength(32);
      expect(string1).not.toBe(string2);
    });

    it('should generate default length string', () => {
      const string = helpers.generateRandomString();
      expect(string).toHaveLength(64); // Default 32 bytes = 64 hex chars
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-03-15');
      const formatted = helpers.formatDate(date);
      expect(formatted).toBe('March 15, 2024');
    });
  });

  describe('calculateWeekNumber', () => {
    it('should calculate week number correctly', () => {
      const startDate = new Date('2024-01-01');
      const currentDate = new Date('2024-01-15'); // 2 weeks later
      const weekNumber = helpers.calculateWeekNumber(startDate, currentDate);
      expect(weekNumber).toBe(3); // Week 3
    });

    it('should use current date if not provided', () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 1 week ago
      const weekNumber = helpers.calculateWeekNumber(startDate);
      expect(weekNumber).toBe(2);
    });
  });

  describe('isDeadlinePassed', () => {
    it('should return true for past deadline', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(helpers.isDeadlinePassed(pastDate)).toBe(true);
    });

    it('should return false for future deadline', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(helpers.isDeadlinePassed(futureDate)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const sanitized = helpers.sanitizeInput(input);
      expect(sanitized).toBe('Hello scriptalert("xss")/script World');
    });

    it('should trim whitespace', () => {
      const input = '  hello world  ';
      const sanitized = helpers.sanitizeInput(input);
      expect(sanitized).toBe('hello world');
    });

    it('should return non-string values unchanged', () => {
      expect(helpers.sanitizeInput(123)).toBe(123);
      expect(helpers.sanitizeInput(null)).toBe(null);
      expect(helpers.sanitizeInput(undefined)).toBe(undefined);
    });
  });

  describe('paginate', () => {
    it('should calculate pagination correctly', () => {
      const query1 = { page: 2, limit: 10 };
      const result1 = helpers.paginate(query1);
      expect(result1).toEqual({ limit: 10, offset: 10 });

      const query2 = { page: 5, limit: 20 };
      const result2 = helpers.paginate(query2);
      expect(result2).toEqual({ limit: 20, offset: 80 });
    });

    it('should use defaults when not provided', () => {
      const result = helpers.paginate({});
      expect(result).toEqual({ limit: 10, offset: 0 });
    });
  });
});