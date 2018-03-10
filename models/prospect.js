'use strict'
module.exports = function (sequelize, DataTypes) {
  var Prospect = sequelize.define('Prospect', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address'
        }
      }
    }
  }, {})

  return Prospect
}
