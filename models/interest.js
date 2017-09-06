'use strict'
module.exports = function (sequelize, DataTypes) {
  var Interest = sequelize.define('Interest', {
    projectId: DataTypes.INTEGER,
    freelancerId: DataTypes.INTEGER,
    selected: DataTypes.BOOLEAN
  }, {})

  Interest.associate = function (models) {
    Interest.belongsTo(models.Project, {as: 'project', foreignKey: 'projectId'})
    Interest.belongsTo(models.Freelancer, {as: 'freelancer', foreignKey: 'freelancerId'})
  }

  return Interest
}
