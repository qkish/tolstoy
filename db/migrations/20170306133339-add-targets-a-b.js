'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'target_point_a',
      {
        type: Sequelize.INTEGER,
        defaultValue: null
      }
    )
    queryInterface.addColumn(
      'users',
      'target_point_b',
      {
        type: Sequelize.INTEGER,
        defaultValue: null
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'target_point_a')
    queryInterface.removeColumn('users', 'target_point_b')
  }
};
