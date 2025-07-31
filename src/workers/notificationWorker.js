const { notificationQueue } = require('../config/redis');
const activityService = require('../services/activityService');
const notificationService = require('../services/notificationService');

// Process notification queue
notificationQueue.process('activity-submission', async (job) => {
  const { type, recipientEmail, data } = job.data;
  
  console.log(`Sending ${type} notification to ${recipientEmail}`);
  console.log('Data:', data);
  
  // In production, you would send actual emails here
  // For now, we'll just log
  
  return { sent: true, timestamp: new Date() };
});

notificationQueue.process('missing-logs', async (job) => {
  const { type, recipientEmail, data } = job.data;
  
  console.log(`Sending ${type} reminder to ${recipientEmail}`);
  console.log('Missing weeks:', data.missingWeeks);
  console.log('Deadline:', data.deadline);
  
  return { sent: true, timestamp: new Date() };
});

notificationQueue.process('deadline-missed', async (job) => {
  const { type, recipientEmail, data } = job.data;
  
  console.log(`Sending ${type} notification to ${recipientEmail}`);
  console.log('Course Offering ID:', data.courseOfferingId);
  console.log('Week Number:', data.weekNumber);
  
  return { sent: true, timestamp: new Date() };
});

// Check for missing logs (runs weekly)
const checkMissingLogs = async () => {
  try {
    console.log('Checking for missing activity logs...');
    
    const missingLogs = await activityService.getMissingLogs();
    
    // Group by facilitator
    const missingByFacilitator = {};
    missingLogs.forEach(log => {
      const facilitatorId = log.facilitator.id;
      if (!missingByFacilitator[facilitatorId]) {
        missingByFacilitator[facilitatorId] = [];
      }
      missingByFacilitator[facilitatorId].push(log);
    });
    
    // Send reminders
    for (const [facilitatorId, logs] of Object.entries(missingByFacilitator)) {
      await notificationService.notifyMissingLogs(
        facilitatorId,
        logs.map(l => ({ 
          courseOfferingId: l.courseOfferingId, 
          weekNumber: l.weekNumber 
        }))
      );
    }
    
    console.log(`Sent reminders for ${Object.keys(missingByFacilitator).length} facilitators`);
  } catch (error) {
    console.error('Error checking missing logs:', error);
  }
};

module.exports = {
  checkMissingLogs
};