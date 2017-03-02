'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'task_replies',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        url: Sequelize.STRING,
        username: Sequelize.STRING,
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        program: Sequelize.STRING,
        volunteer: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('task_replies')
  }
};
