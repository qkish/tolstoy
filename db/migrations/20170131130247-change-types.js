'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.changeColumn(
          'users',
          'vesting_total',
          {
            type: Sequelize.DOUBLE
          }
      )
      queryInterface.changeColumn(
          'users',
          'total',
          {
            type: Sequelize.DOUBLE
          }
      )
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.changeColumn(
          'users',
          'vesting_total',
          {
            type: Sequelize.INTEGER
          }
      )
      queryInterface.changeColumn(
          'users',
          'total',
          {
            type: Sequelize.INTEGER
          }
      )
  }
};
