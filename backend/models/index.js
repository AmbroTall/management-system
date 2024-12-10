const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Role = require('./roles');
const Member = require('./member');
const ActivityLog = require('./activity');

const models = {
  User,
  Role,
  Member,
  ActivityLog,
};

// Add relationships
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { ...models, sequelize };
