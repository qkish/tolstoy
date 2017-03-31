'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'game',
      'money',
      {
        type: Sequelize.INTEGER
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('game', 'money')
  }
};
