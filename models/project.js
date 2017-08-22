'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    type: DataTypes.TEXT,
    description: DataTypes.TEXT,
    rate: DataTypes.DECIMAL,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    acceptingApps: DataTypes.BOOLEAN,
    completed: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Project;
};