'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'last_day_money',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'last_day_money')
  }
};
