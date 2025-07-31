const { 
  ActivityLog, 
  CourseOffering,
  User,
  Module,
  Cohort,
  Class,
  Mode
} = require('../../../src/models');
const { sequelize } = require('../../../src/config/database');

describe('ActivityLog Model', () => {
  let courseOffering;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create required records
    const facilitator = await User.create({
      email: 'activity@test.com',
      passwordHash: 'password',
      firstName: 'Activity',
      lastName: 'Tester',
      role: 'FACILITATOR'
    });

    const module = await Module.create({
      code: 'TEST101',
      title: 'Test Module',
      credits: 3
    });

    const cohort = await Cohort.create({
      name: 'Test Cohort',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    });

    const classInstance = await Class.create({
      name: 'TEST2024',
      year: 2024,
      section: 'A'
    });

    const mode = await Mode.create({
      name: 'HYBRID',
      description: 'Hybrid delivery'
    });

    courseOffering = await CourseOffering.create({
      moduleId: module.id,
      cohortId: cohort.id,
      classId: classInstance.id,
      facilitatorId: facilitator.id,
      modeId: mode.id,
      trimester: 'T2',
      intakePeriod: 'HT1',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-08-31')
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await ActivityLog.destroy({ where: {} });
  });

  describe('ActivityLog Creation', () => {
    it('should create an activity log with valid data', async () => {
      const logData = {
        courseOfferingId: courseOffering.id,
        weekNumber: 5,
        attendance: [true, false, true, true, false],
        formativeOneGrading: 'DONE',
        formativeTwoGrading: 'PENDING',
        summativeGrading: 'NOT_STARTED',
        courseModeration: 'NOT_STARTED',
        intranetSync: 'DONE',
        gradeBookStatus: 'PENDING',
        notes: 'Week 5 activities completed'
      };

      const log = await ActivityLog.create(logData);

      expect(log.id).toBeDefined();
      expect(log.weekNumber).toBe(5);
      expect(log.attendance).toEqual([true, false, true, true, false]);
      expect(log.formativeOneGrading).toBe('DONE');
      expect(log.notes).toBe('Week 5 activities completed');
    });

    it('should validate week number range', async () => {
      const invalidLog = {
        courseOfferingId: courseOffering.id,
        weekNumber: 17 // Max is 16
      };

      await expect(ActivityLog.create(invalidLog)).rejects.toThrow();
    });

    it('should validate status enum values', async () => {
      const invalidLog = {
        courseOfferingId: courseOffering.id,
        weekNumber: 1,
        formativeOneGrading: 'INVALID_STATUS'
      };

      await expect(ActivityLog.create(invalidLog)).rejects.toThrow();
    });

    it('should handle JSON attendance field', async () => {
      const log = await ActivityLog.create({
        courseOfferingId: courseOffering.id,
        weekNumber: 1,
        attendance: [true, true, false, true]
      });

      const retrieved = await ActivityLog.findByPk(log.id);
      expect(Array.isArray(retrieved.attendance)).toBe(true);
      expect(retrieved.attendance).toEqual([true, true, false, true]);
    });
  });

  describe('ActivityLog Defaults', () => {
    it('should set default values for status fields', async () => {
      const log = await ActivityLog.create({
        courseOfferingId: courseOffering.id,
        weekNumber: 3
      });

      expect(log.formativeOneGrading).toBe('NOT_STARTED');
      expect(log.formativeTwoGrading).toBe('NOT_STARTED');
      expect(log.summativeGrading).toBe('NOT_STARTED');
      expect(log.courseModeration).toBe('NOT_STARTED');
      expect(log.intranetSync).toBe('NOT_STARTED');
      expect(log.gradeBookStatus).toBe('NOT_STARTED');
      expect(log.attendance).toEqual([]);
    });
  });
});