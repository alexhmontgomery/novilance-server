'use strict'
module.exports = function (sequelize, DataTypes) {
  var Employer = sequelize.define('Employer', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    organization: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {})

  Employer.associate = function (models) {
    Employer.hasMany(models.Project, {as: 'project', foreignKey: 'employerId'})
  }

  return Employer
}
