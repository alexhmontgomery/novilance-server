'use strict'
module.exports = function (sequelize, DataTypes) {
  var Freelancer = sequelize.define('Freelancer', {
    username: DataTypes.STRING,
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
    givenName: DataTypes.STRING,
    surname: DataTypes.STRING,
    description: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    school: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {})

  Freelancer.associate = function (models) {
    Freelancer.hasMany(models.Interest, {as: 'interest', foreignKey: 'freelancerId'})
  }

  return Freelancer
}
