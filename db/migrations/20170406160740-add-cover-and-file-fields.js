'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'posts_content',
        'cover',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'posts_content',
        'file',
        Sequelize.STRING
      )
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('posts_content', 'cover'),
      queryInterface.removeColumn('posts_content', 'file')
    ])
  }
};
