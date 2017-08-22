'use strict'
module.exports = function (sequelize, DataTypes) {
  var Employer = sequelize.define('Employer', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return Employer
}
