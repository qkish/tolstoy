'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.changeColumn(
          'users',
          'last_total_transaction',
          {
            type: Sequelize.DATEONLY
          }
      )
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.changeColumn(
          'users',
          'last_total_transaction',
          {
            type: Sequelize.DATE
          }
      )
  }
};
