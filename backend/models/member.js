const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  profile_picture: {
    type: DataTypes.STRING,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'members',
  paranoid: true, 
  timestamps: true,
});

// Define relationships
Member.associate = (models) => {
    Member.belongsTo(models.Role, { foreignKey: 'role_id' });
    Member.belongsTo(models.User, { as: 'creator', foreignKey: 'created_by' }); // Added 'as: creator'
    Member.hasMany(models.ActivityLog, { foreignKey: 'member_id' });
};

module.exports = Member;
