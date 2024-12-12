const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },

}, {
  tableName: 'roles',
  paranoid: true,
  timestamps: true,
});

// Define relationships
Role.associate = (models) => {
  Role.hasMany(models.User, { foreignKey: 'role_id' });
  Role.hasMany(models.Member, { foreignKey: 'role_id' });
};

module.exports = Role;
