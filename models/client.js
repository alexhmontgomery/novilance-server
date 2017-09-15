'use strict'
module.exports = function (sequelize, DataTypes) {
  var Client = sequelize.define('Client', {
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter a valid email address'
        },
        isEmail: {
          msg: 'Please enter a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please enter a password'
        },
        len: {
          args: [5, 20],
          msg: 'Password must be 5-20 characters'
        }
      }
    },
    role: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    organization: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {})

  Client.associate = function (models) {
    Client.hasMany(models.Project, {as: 'project', foreignKey: 'clientId'})
  }

  return Client
}
