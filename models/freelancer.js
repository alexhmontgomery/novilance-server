'use strict'
module.exports = function (sequelize, DataTypes) {
  var Freelancer = sequelize.define('Freelancer', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    givenName: DataTypes.STRING,
    surname: DataTypes.STRING,
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
  return Freelancer
}
