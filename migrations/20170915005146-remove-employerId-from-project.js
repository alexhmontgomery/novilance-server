'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Projects',
      'employerId'
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Projects',
      'employerId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Employers',
          key: 'id'
        }
      }
    )
  }
}
