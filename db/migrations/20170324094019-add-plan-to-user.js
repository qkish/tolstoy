'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'plan',
        {
          type: Sequelize.INTEGER,
        }
      ),
      queryInterface.addColumn(
        'users',
        'word_price',
        {
          type: Sequelize.STRING,
        }
      )
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'plan'),
      queryInterface.removeColumn('users', 'word_price')
    ])
  }
};
