'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
          'importedUsers',
          {
              email: Sequelize.STRING,
              polk: Sequelize.INTEGER,
              date: Sequelize.STRING,
              monets: Sequelize.INTEGER,
              city: Sequelize.STRING,
              sotka: Sequelize.INTEGER

          }
      ).then(function () {
          queryInterface.addIndex('importedUsers', ['email'])
      })
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('importedUsers')
  }
};
