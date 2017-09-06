'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addConstraint(
      'Interests',
      ['projectId', 'freelancerId'], {
        type: 'unique',
        name: 'uniqueFreelancerInterest'
      })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      'Interests',
      'uniqueFreelancerInterest'
    )
  }
}
