'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'settings',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: Sequelize.STRING,
        name: Sequelize.STRING,
        value: Sequelize.STRING
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('settings')
  }
};
