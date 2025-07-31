const { notificationQueue } = require('../config/redis');
const { User, ActivityLog, CourseOffering } = require('../models');

const notifyActivitySubmission = async (activityLogId) => {
  const log = await ActivityLog.findByPk(activityLogId, {
    include: [
      {
        model: CourseOffering,
        include: [
          {
            model: User,
            as: 'facilitator'
          }
        ]
      }
    ]
  });

  // Get all managers
  const managers = await User.findAll({
    where: { role: 'MANAGER', isActive: true }
  });

  // Queue notification for each manager
  for (const manager of managers) {
    await notificationQueue.add('activity-submission', {
      type: 'ACTIVITY_SUBMITTED',
      recipientId: manager.id,
      recipientEmail: manager.email,
      data: {
        facilitatorName: `${log.CourseOffering.facilitator.firstName} ${log.CourseOffering.facilitator.lastName}`,
        weekNumber: log.weekNumber,
        courseOfferingId: log.courseOfferingId,
        submittedAt: log.submittedAt
      }
    });
  }
};

const notifyMissingLogs = async (facilitatorId, missingWeeks) => {
  const facilitator = await User.findByPk(facilitatorId);
  
  if (!facilitator) {
    return;
  }

  await notificationQueue.add('missing-logs', {
    type: 'MISSING_LOGS_REMINDER',
    recipientId: facilitator.id,
    recipientEmail: facilitator.email,
    data: {
      missingWeeks,
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
    }
  });
};

const notifyDeadlineMissed = async (facilitatorId, courseOfferingId, weekNumber) => {
  const facilitator = await User.findByPk(facilitatorId);
  const managers = await User.findAll({
    where: { role: 'MANAGER', isActive: true }
  });

  // Notify facilitator
  await notificationQueue.add('deadline-missed', {
    type: 'DEADLINE_MISSED',
    recipientId: facilitator.id,
    recipientEmail: facilitator.email,
    data: {
      courseOfferingId,
      weekNumber
    }
  });

  // Notify managers
  for (const manager of managers) {
    await notificationQueue.add('deadline-missed-manager', {
      type: 'FACILITATOR_DEADLINE_MISSED',
      recipientId: manager.id,
      recipientEmail: manager.email,
      data: {
        facilitatorName: `${facilitator.firstName} ${facilitator.lastName}`,
        courseOfferingId,
        weekNumber
      }
    });
  }
};

const processNotificationQueue = async () => {
  // This would typically send emails or other notifications
  // For now, we'll just log them
  console.log('Processing notification queue...');
};

module.exports = {
  notifyActivitySubmission,
  notifyMissingLogs,
  notifyDeadlineMissed,
  processNotificationQueue
};