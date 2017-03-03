'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'task_replies',
      'created_at',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
    queryInterface.addColumn(
      'task_replies',
      'updated_at',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('task_replies', 'created_at')
    queryInterface.removeColumn('task_replies', 'updated_at')
  }
};
