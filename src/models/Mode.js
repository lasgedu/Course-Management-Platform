const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Mode extends Model {}

Mode.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.ENUM('ONLINE', 'IN_PERSON', 'HYBRID'),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Mode',
  tableName: 'modes',
  timestamps: true
});

module.exports = Mode;