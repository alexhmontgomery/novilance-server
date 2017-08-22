'use strict'
module.exports = function (sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    type: DataTypes.TEXT,
    description: DataTypes.TEXT,
    rate: DataTypes.DECIMAL(10, 2),
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    acceptingApps: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN
  }, {})

  Project.associate = function (models) {
    Project.belongsTo(models.Employer, {as: 'employer', foreignKey: 'employerId'})
  }

  return Project
}
