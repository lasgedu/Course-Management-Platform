const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class CourseOffering extends Model {}

CourseOffering.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules',
      key: 'id'
    }
  },
  cohortId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  facilitatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  modeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modes',
      key: 'id'
    }
  },
  trimester: {
    type: DataTypes.ENUM('T1', 'T2', 'T3'),
    allowNull: false
  },
  intakePeriod: {
    type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'CourseOffering',
  tableName: 'course_offerings',
  timestamps: true
});

module.exports = CourseOffering;