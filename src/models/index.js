const { sequelize } = require('../config/database');
const User = require('./User');
const Module = require('./Module');
const Cohort = require('./Cohort');
const Class = require('./Class');
const Mode = require('./Mode');
const CourseOffering = require('./CourseOffering');
const ActivityLog = require('./ActivityLog');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(CourseOffering, { as: 'teachings', foreignKey: 'facilitatorId' });
  
  // CourseOffering associations
  CourseOffering.belongsTo(User, { as: 'facilitator', foreignKey: 'facilitatorId' });
  CourseOffering.belongsTo(Module, { foreignKey: 'moduleId' });
  CourseOffering.belongsTo(Cohort, { foreignKey: 'cohortId' });
  CourseOffering.belongsTo(Class, { foreignKey: 'classId' });
  CourseOffering.belongsTo(Mode, { foreignKey: 'modeId' });
  CourseOffering.hasMany(ActivityLog, { foreignKey: 'courseOfferingId' });
  
  // ActivityLog associations
  ActivityLog.belongsTo(CourseOffering, { foreignKey: 'courseOfferingId' });
  
  // Module associations
  Module.hasMany(CourseOffering, { foreignKey: 'moduleId' });
  
  // Cohort associations
  Cohort.hasMany(CourseOffering, { foreignKey: 'cohortId' });
  
  // Class associations
  Class.hasMany(CourseOffering, { foreignKey: 'classId' });
  
  // Mode associations
  Mode.hasMany(CourseOffering, { foreignKey: 'modeId' });
};

defineAssociations();

module.exports = {
  sequelize,
  User,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityLog
};