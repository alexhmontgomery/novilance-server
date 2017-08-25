'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2)
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      acceptingApps: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      completed: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      employerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Employers',
          key: 'id'
        }
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
    return queryInterface.dropTable('Projects')
  }
}
