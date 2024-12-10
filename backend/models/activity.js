const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'activity_logs',
  timestamps: false,
});

// Define relationships
ActivityLog.associate = (models) => {
  ActivityLog.belongsTo(models.User, { foreignKey: 'user_id' });
  ActivityLog.belongsTo(models.Member, { foreignKey: 'member_id' });
};

module.exports = ActivityLog;
