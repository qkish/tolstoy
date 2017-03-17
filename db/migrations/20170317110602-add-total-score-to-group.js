'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'groups',
      'total_score',
      {
        type: Sequelize.DOUBLE,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('groups', 'total_score')
  }
};
