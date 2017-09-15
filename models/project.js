'use strict'
module.exports = function (sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    type: DataTypes.TEXT,
    description: DataTypes.TEXT,
    rate: DataTypes.DECIMAL,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    acceptingApps: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE
  }, {})

  Project.associate = function (models) {
    Project.belongsTo(models.Client, {as: 'client', foreignKey: 'clientId'})
    Project.hasMany(models.Interest, {as: 'interest', foreignKey: 'projectId'})
  }

  return Project
}
