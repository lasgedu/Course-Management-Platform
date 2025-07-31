const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ActivityLog extends Model {}

ActivityLog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseOfferingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'course_offerings',
      key: 'id'
    }
  },
  weekNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 16
    }
  },
  attendance: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('attendance');
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  },
  formativeOneGrading: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  formativeTwoGrading: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  summativeGrading: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  courseModeration: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  intranetSync: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  gradeBookStatus: {
    type: DataTypes.ENUM('DONE', 'PENDING', 'NOT_STARTED'),
    defaultValue: 'NOT_STARTED'
  },
  submittedAt: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'ActivityLog',
  tableName: 'activity_logs',
  timestamps: true
});

module.exports = ActivityLog;