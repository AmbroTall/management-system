const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Define relationships
User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'role_id' });
  User.hasMany(models.Member, { as: 'createdMembers', foreignKey: 'created_by' }); // Added 'as: createdMembers'
  User.hasMany(models.ActivityLog, { foreignKey: 'user_id' });
};

module.exports = User;
