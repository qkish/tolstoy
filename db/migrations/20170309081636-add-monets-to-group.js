'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('groups', 'monets', Sequelize.INTEGER)
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('groups', 'monets')
  }
}
