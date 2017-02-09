'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('users', 'desyatka', 'ten');
      queryInterface.renameColumn('users', 'sotnya', 'hundred');
      queryInterface.renameColumn('users', 'desyatnik', 'ten_leader');
      queryInterface.renameColumn('users', 'sotnik', 'hundred_leader');
      queryInterface.renameColumn('users', 'polkovodec', 'polk_leader');
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.renameColumn('users', 'ten', 'desyatka');
      queryInterface.renameColumn('users', 'hundred', 'sotnya');
      queryInterface.renameColumn('users', 'ten_leader', 'desyatnik');
      queryInterface.renameColumn('users', 'hundred_leader', 'sotnik');
      queryInterface.renameColumn('users', 'polk_leader', 'polkovodec');
  }
};
