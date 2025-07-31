const { 
  CourseOffering, 
  User, 
  Module, 
  Cohort, 
  Class, 
  Mode 
} = require('../../../src/models');
const { sequelize } = require('../../../src/config/database');

describe('CourseOffering Model', () => {
  let facilitator, module, cohort, classInstance, mode;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create required related records
    facilitator = await User.create({
      email: 'facilitator@test.com',
      passwordHash: 'password',
      firstName: 'Test',
      lastName: 'Facilitator',
      role: 'FACILITATOR'
    });

    module = await Module.create({
      code: 'CS101',
      title: 'Introduction to Computer Science',
      credits: 3
    });

    cohort = await Cohort.create({
      name: 'Cohort 2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    });

    classInstance = await Class.create({
      name: '2024S',
      year: 2024,
      section: 'S'
    });

    mode = await Mode.create({
      name: 'ONLINE',
      description: 'Online delivery'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await CourseOffering.destroy({ where: {} });
  });

  describe('CourseOffering Creation', () => {
    it('should create a course offering with valid data', async () => {
      const offeringData = {
        moduleId: module.id,
        cohortId: cohort.id,
        classId: classInstance.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'T1',
        intakePeriod: 'FT',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15')
      };

      const offering = await CourseOffering.create(offeringData);

      expect(offering.id).toBeDefined();
      expect(offering.trimester).toBe('T1');
      expect(offering.intakePeriod).toBe('FT');
      expect(offering.isActive).toBe(true);
    });

    it('should enforce foreign key constraints', async () => {
      const offeringData = {
        moduleId: 9999, // Non-existent ID
        cohortId: cohort.id,
        classId: classInstance.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'T1',
        intakePeriod: 'FT',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15')
      };

      await expect(CourseOffering.create(offeringData)).rejects.toThrow();
    });

    it('should validate enum values', async () => {
      const offeringData = {
        moduleId: module.id,
        cohortId: cohort.id,
        classId: classInstance.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'T4', // Invalid trimester
        intakePeriod: 'FT',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15')
      };

      await expect(CourseOffering.create(offeringData)).rejects.toThrow();
    });
  });

  describe('CourseOffering Associations', () => {
    it('should load associations correctly', async () => {
      const offering = await CourseOffering.create({
        moduleId: module.id,
        cohortId: cohort.id,
        classId: classInstance.id,
        facilitatorId: facilitator.id,
        modeId: mode.id,
        trimester: 'T1',
        intakePeriod: 'FT',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15')
      });

      const offeringWithAssociations = await CourseOffering.findByPk(offering.id, {
        include: [
          { model: Module },
          { model: Cohort },
          { model: Class },
          { model: Mode },
          { model: User, as: 'facilitator' }
        ]
      });

      expect(offeringWithAssociations.Module.code).toBe('CS101');
      expect(offeringWithAssociations.Cohort.name).toBe('Cohort 2024');
      expect(offeringWithAssociations.Class.name).toBe('2024S');
      expect(offeringWithAssociations.Mode.name).toBe('ONLINE');
      expect(offeringWithAssociations.facilitator.email).toBe('facilitator@test.com');
    });
  });
});