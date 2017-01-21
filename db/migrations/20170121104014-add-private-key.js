'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'accounts',
          'private_key',
          {
            type: Sequelize.STRING
          }
        ).then(function () {
            queryInterface.addIndex('accounts', ['private_key']);
        });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('accounts', 'private_key')
  }
};
