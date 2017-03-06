'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'target_point_a',
      {
        type: Sequelize.STRING,
        defaultValue: null
      }
    )
    queryInterface.addColumn(
      'users',
      'target_point_b',
      {
        type: Sequelize.STRING,
        defaultValue: null
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'target_point_a')
    queryInterface.removeColumn('users', 'target_point_b')
  }
};
