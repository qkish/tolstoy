'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.addColumn('users', 'polk', Sequelize.INTEGER);
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('users', 'polk');
  }
};
