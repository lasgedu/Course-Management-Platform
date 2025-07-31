const courseService = require('../services/courseService');

const createCourseOffering = async (req, res, next) => {
  try {
    const course = await courseService.createCourseOffering(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

const getCourseOfferings = async (req, res, next) => {
  try {
    const filters = {
      trimester: req.query.trimester,
      cohortId: req.query.cohortId,
      facilitatorId: req.query.facilitatorId,
      modeId: req.query.modeId,
      intakePeriod: req.query.intakePeriod
    };

    // If user is facilitator, only show their courses
    if (req.user.role === 'FACILITATOR') {
      filters.facilitatorId = req.user.id;
    }

    const courses = await courseService.getCourseOfferings(filters);
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourseOfferingById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseOfferingById(req.params.id);
    
    // Check if facilitator can access this course
    if (req.user.role === 'FACILITATOR' && course.facilitatorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

const updateCourseOffering = async (req, res, next) => {
  try {
    const course = await courseService.updateCourseOffering(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    next(error);
  }
};

const deleteCourseOffering = async (req, res, next) => {
  try {
    await courseService.deleteCourseOffering(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Module CRUD operations
const createModule = async (req, res, next) => {
  try {
    const module = await courseService.createModule(req.body);
    res.status(201).json(module);
  } catch (error) {
    next(error);
  }
};

const getModules = async (req, res, next) => {
  try {
    const modules = await courseService.getModules();
    res.json(modules);
  } catch (error) {
    next(error);
  }
};

// Cohort CRUD operations
const createCohort = async (req, res, next) => {
  try {
    const cohort = await courseService.createCohort(req.body);
    res.status(201).json(cohort);
  } catch (error) {
    next(error);
  }
};

const getCohorts = async (req, res, next) => {
  try {
    const cohorts = await courseService.getCohorts();
    res.json(cohorts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourseOffering,
  getCourseOfferings,
  getCourseOfferingById,
  updateCourseOffering,
  deleteCourseOffering,
  createModule,
  getModules,
  createCohort,
  getCohorts
};