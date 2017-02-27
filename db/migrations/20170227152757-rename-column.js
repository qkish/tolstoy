'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'last_total_transaction', 'last_money_transaction')
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'last_money_transaction', 'last_total_transaction')
  }
};
