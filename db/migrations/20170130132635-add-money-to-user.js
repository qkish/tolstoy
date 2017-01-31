'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('users', 'vesting_total', Sequelize.INTEGER);
      queryInterface.addColumn('users', 'monets', Sequelize.INTEGER);
      queryInterface.addColumn('users', 'money_total', Sequelize.INTEGER);
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('users', 'vesting_total');
      queryInterface.removeColumn('users', 'monets');
      queryInterface.removeColumn('users', 'money_total');
  }
};
