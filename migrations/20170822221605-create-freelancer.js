'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Freelancers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      givenName: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Freelancers')
  }
}