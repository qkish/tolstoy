'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'groups',
      'type',
      {
        type: Sequelize.ENUM('polk', 'hundred', 'ten', 'couch', 'couch_mzs')
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'groups',
      'type',
      {
        type: Sequelize.ENUM('polk', 'hundred', 'ten', 'couch')
      }
    )
  }
};
