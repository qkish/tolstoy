'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.addColumn(
     'task_replies',
     'tags',
     Sequelize.STRING
   )
   queryInterface.addColumn(
     'task_replies',
     'money',
     Sequelize.INTEGER
   )
   queryInterface.addColumn(
     'task_replies',
     'category',
     Sequelize.STRING
   )
   queryInterface.addColumn(
     'task_replies',
     'permlink',
     Sequelize.STRING
   )
   queryInterface.addColumn(
     'task_replies',
     'created',
     Sequelize.DATE
   )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('task_replies', 'tags')
    queryInterface.removeColumn('task_replies', 'money')
    queryInterface.removeColumn('task_replies', 'category')
    queryInterface.removeColumn('task_replies', 'permlink')
    queryInterface.removeColumn('task_replies', 'created')
  }
};
