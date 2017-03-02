'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'task_replies',
      'created_at',
      {
        allowNull: false,
        type: Sequelize.DATE
      }
    )
    queryInterface.addColumn(
      'task_replies',
      'updated_at',
      {
        allowNull: false,
        type: Sequelize.DATE
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('task_replies', 'created_at')
    queryInterface.removeColumn('task_replies', 'updated_at')
  }
};
