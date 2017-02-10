'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('users', 'polkovodec', 'polk_leader');
      queryInterface.renameColumn('users', 'sotnik', 'hundred_leader');
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('users', 'polk_leader', 'polkovodec');
      queryInterface.renameColumn('users', 'hundred_leader', 'sotnik');
  }
};
