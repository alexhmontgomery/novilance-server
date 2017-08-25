'use strict';
module.exports = function(sequelize, DataTypes) {
  var Freelancer = sequelize.define('Freelancer', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    givenName: DataTypes.STRING,
    surname: DataTypes.STRING,
    description: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    school: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Freelancer;
};