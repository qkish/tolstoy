'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'last_day_money'),
      queryInterface.removeColumn('users', 'total'),
      queryInterface.removeColumn('users', 'last_money_transaction'),
      queryInterface.addColumn(
        'users',
        'posts_money',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'users',
        'tasks_money',
        Sequelize.INTEGER
      )
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'last_day_money',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'users',
        'total',
        Sequelize.DOUBLE
      ),
      queryInterface.addColumn(
        'users',
        'last_money_transaction',
        Sequelize.DATE
      ),
      queryInterface.removeColumn('users', 'posts_money'),
      queryInterface.removeColumn('users', 'tasks_money')
    ])
  }
}
