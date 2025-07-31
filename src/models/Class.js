const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Class extends Model {}

Class.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Class',
  tableName: 'classes',
  timestamps: true
});

module.exports = Class;