const { 
  ActivityLog, 
  CourseOffering, 
  Module, 
  User 
} = require('../models');
const notificationService = require('./notificationService');
const { Op } = require('sequelize');

const createActivityLog = async (data) => {
  // Verify the facilitator owns this course offering
  const courseOffering = await CourseOffering.findByPk(data.courseOfferingId);
  
  if (!courseOffering) {
    throw new Error('Course offering not found');
  }

  if (courseOffering.facilitatorId !== data.facilitatorId) {
    throw new Error('You are not authorized to create logs for this course');
  }

  // Check if log already exists for this week
  const existingLog = await ActivityLog.findOne({
    where: {
      courseOfferingId: data.courseOfferingId,
      weekNumber: data.weekNumber
    }
  });

  if (existingLog) {
    throw new Error('Activity log already exists for this week');
  }

  const log = await ActivityLog.create({
    ...data,
    submittedAt: new Date()
  });

  // Notify manager about submission
  await notificationService.notifyActivitySubmission(log.id);

  return getActivityLogById(log.id);
};

const getActivityLogs = async (filters = {}) => {
  const where = {};
  
  if (filters.courseOfferingId) {
    where.courseOfferingId = filters.courseOfferingId;
  }
  
  if (filters.weekNumber) {
    where.weekNumber = filters.weekNumber;
  }

  const include = [
    {
      model: CourseOffering,
      include: [
        {
          model: Module,
          attributes: ['code', 'title']
        },
        {
          model: User,
          as: 'facilitator',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    }
  ];

  // If filtering by facilitator, add condition to CourseOffering
  if (filters.facilitatorId) {
    include[0].where = { facilitatorId: filters.facilitatorId };
  }

  const logs = await ActivityLog.findAll({
    where,
    include,
    order: [['weekNumber', 'DESC'], ['createdAt', 'DESC']]
  });

  return logs;
};

const getActivityLogById = async (id, user = null) => {
  const log = await ActivityLog.findByPk(id, {
    include: [
      {
        model: CourseOffering,
        include: [
          {
            model: Module,
            attributes: ['code', 'title', 'description']
          },
          {
            model: User,
            as: 'facilitator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      }
    ]
  });

  if (!log) {
    throw new Error('Activity log not found');
  }

  // Check authorization if user provided
  if (user && user.role === 'FACILITATOR') {
    if (log.CourseOffering.facilitatorId !== user.id) {
      throw new Error('Access denied');
    }
  }

  return log;
};

const updateActivityLog = async (id, updates, user) => {
  const log = await getActivityLogById(id, user);

  // Only certain fields can be updated
  const allowedUpdates = [
    'attendance',
    'formativeOneGrading',
    'formativeTwoGrading',
    'summativeGrading',
    'courseModeration',
    'intranetSync',
    'gradeBookStatus',
    'notes'
  ];

  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  await log.update(filteredUpdates);

  return getActivityLogById(id);
};

const deleteActivityLog = async (id, user) => {
  const log = await getActivityLogById(id, user);
  await log.destroy();
  return true;
};

const getActivitySummary = async (filters = {}) => {
  const where = {};
  
  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
    };
  }

  const summary = await ActivityLog.findAll({
    where,
    include: [
      {
        model: CourseOffering,
        include: [
          {
            model: Module,
            attributes: ['code', 'title']
          },
          {
            model: User,
            as: 'facilitator',
            attributes: ['firstName', 'lastName']
          }
        ]
      }
    ],
    attributes: [
      'weekNumber',
      'formativeOneGrading',
      'formativeTwoGrading',
      'summativeGrading',
      'courseModeration',
      'intranetSync',
      'gradeBookStatus'
    ]
  });

  // Process summary statistics
  const stats = {
    totalLogs: summary.length,
    byStatus: {
      formativeOneGrading: { DONE: 0, PENDING: 0, NOT_STARTED: 0 },
      formativeTwoGrading: { DONE: 0, PENDING: 0, NOT_STARTED: 0 },
      summativeGrading: { DONE: 0, PENDING: 0, NOT_STARTED: 0 },
      courseModeration: { DONE: 0, PENDING: 0, NOT_STARTED: 0 },
      intranetSync: { DONE: 0, PENDING: 0, NOT_STARTED: 0 },
      gradeBookStatus: { DONE: 0, PENDING: 0, NOT_STARTED: 0 }
    }
  };

  summary.forEach(log => {
    Object.keys(stats.byStatus).forEach(field => {
      stats.byStatus[field][log[field]]++;
    });
  });

  return { summary, stats };
};

const getMissingLogs = async () => {
  const currentWeek = Math.ceil((new Date() - new Date('2024-01-01')) / (7 * 24 * 60 * 60 * 1000));
  
  const activeCourses = await CourseOffering.findAll({
    where: { isActive: true },
    include: [
      {
        model: User,
        as: 'facilitator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  const missingLogs = [];

  for (const course of activeCourses) {
    for (let week = 1; week <= currentWeek && week <= 16; week++) {
      const logExists = await ActivityLog.findOne({
        where: {
          courseOfferingId: course.id,
          weekNumber: week
        }
      });

      if (!logExists) {
        missingLogs.push({
          courseOfferingId: course.id,
          moduleCode: course.Module?.code,
          facilitator: course.facilitator,
          weekNumber: week
        });
      }
    }
  }

  return missingLogs;
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
  getActivitySummary,
  getMissingLogs
};