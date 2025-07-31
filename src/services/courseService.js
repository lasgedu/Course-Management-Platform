const { 
  CourseOffering, 
  Module, 
  Cohort, 
  Class, 
  Mode, 
  User 
} = require('../models');
const { Op } = require('sequelize');

const createCourseOffering = async (data) => {
  const courseOffering = await CourseOffering.create(data);
  
  return getCourseOfferingById(courseOffering.id);
};

const getCourseOfferings = async (filters = {}) => {
  const where = {};
  
  // Apply filters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '') {
      where[key] = filters[key];
    }
  });

  const courseOfferings = await CourseOffering.findAll({
    where,
    include: [
      {
        model: Module,
        attributes: ['id', 'code', 'title', 'credits']
      },
      {
        model: Cohort,
        attributes: ['id', 'name', 'startDate', 'endDate']
      },
      {
        model: Class,
        attributes: ['id', 'name', 'year', 'section']
      },
      {
        model: Mode,
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'facilitator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return courseOfferings;
};

const getCourseOfferingById = async (id) => {
  const courseOffering = await CourseOffering.findByPk(id, {
    include: [
      {
        model: Module,
        attributes: ['id', 'code', 'title', 'description', 'credits']
      },
      {
        model: Cohort,
        attributes: ['id', 'name', 'description', 'startDate', 'endDate']
      },
      {
        model: Class,
        attributes: ['id', 'name', 'year', 'section', 'maxStudents']
      },
      {
        model: Mode,
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'facilitator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  if (!courseOffering) {
    throw new Error('Course offering not found');
  }

  return courseOffering;
};

const updateCourseOffering = async (id, updates) => {
  const courseOffering = await CourseOffering.findByPk(id);
  
  if (!courseOffering) {
    throw new Error('Course offering not found');
  }

  await courseOffering.update(updates);
  
  return getCourseOfferingById(id);
};

const deleteCourseOffering = async (id) => {
  const courseOffering = await CourseOffering.findByPk(id);
  
  if (!courseOffering) {
    throw new Error('Course offering not found');
  }

  await courseOffering.destroy();
  return true;
};

// Module operations
const createModule = async (data) => {
  return Module.create(data);
};

const getModules = async () => {
  return Module.findAll({
    where: { isActive: true },
    order: [['code', 'ASC']]
  });
};

const getModuleById = async (id) => {
  const module = await Module.findByPk(id);
  if (!module) {
    throw new Error('Module not found');
  }
  return module;
};

const updateModule = async (id, updates) => {
  const module = await Module.findByPk(id);
  if (!module) {
    throw new Error('Module not found');
  }
  await module.update(updates);
  return module;
};

// Cohort operations
const createCohort = async (data) => {
  return Cohort.create(data);
};

const getCohorts = async () => {
  return Cohort.findAll({
    where: { isActive: true },
    order: [['startDate', 'DESC']]
  });
};

const getCohortById = async (id) => {
  const cohort = await Cohort.findByPk(id);
  if (!cohort) {
    throw new Error('Cohort not found');
  }
  return cohort;
};

// Class operations
const createClass = async (data) => {
  return Class.create(data);
};

const getClasses = async () => {
  return Class.findAll({
    where: { isActive: true },
    order: [['year', 'DESC'], ['section', 'ASC']]
  });
};

// Mode operations
const getModes = async () => {
  return Mode.findAll({
    order: [['name', 'ASC']]
  });
};

module.exports = {
  createCourseOffering,
  getCourseOfferings,
  getCourseOfferingById,
  updateCourseOffering,
  deleteCourseOffering,
  createModule,
  getModules,
  getModuleById,
  updateModule,
  createCohort,
  getCohorts,
  getCohortById,
  createClass,
  getClasses,
  getModes
};