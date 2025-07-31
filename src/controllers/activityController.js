const activityService = require('../services/activityService');

const createActivityLog = async (req, res, next) => {
  try {
    // Facilitators can only create logs for their courses
    const log = await activityService.createActivityLog({
      ...req.body,
      facilitatorId: req.user.id
    });
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

const getActivityLogs = async (req, res, next) => {
  try {
    const filters = {
      courseOfferingId: req.query.courseOfferingId,
      weekNumber: req.query.weekNumber,
      facilitatorId: req.query.facilitatorId
    };

    // Facilitators can only see their own logs
    if (req.user.role === 'FACILITATOR') {
      filters.facilitatorId = req.user.id;
    }

    const logs = await activityService.getActivityLogs(filters);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

const getActivityLogById = async (req, res, next) => {
  try {
    const log = await activityService.getActivityLogById(req.params.id, req.user);
    res.json(log);
  } catch (error) {
    next(error);
  }
};

const updateActivityLog = async (req, res, next) => {
  try {
    const log = await activityService.updateActivityLog(
      req.params.id,
      req.body,
      req.user
    );
    res.json(log);
  } catch (error) {
    next(error);
  }
};

const deleteActivityLog = async (req, res, next) => {
  try {
    await activityService.deleteActivityLog(req.params.id, req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getActivitySummary = async (req, res, next) => {
  try {
    const summary = await activityService.getActivitySummary(req.query);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
  getActivitySummary
};