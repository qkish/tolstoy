'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('users', 'current_program', Sequelize.STRING);
      queryInterface.addColumn('users', 'approved_money', Sequelize.INTEGER);
      queryInterface.addColumn('users', 'volunteer', Sequelize.BOOLEAN);
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('users', 'current_program');
      queryInterface.removeColumn('users', 'approved_money');
      queryInterface.removeColumn('users', 'volunteer');
  }
};
