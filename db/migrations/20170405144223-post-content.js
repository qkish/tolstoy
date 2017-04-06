'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('posts_content', {
      // secondary keys
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'posts'
        }
      },
      rating: {
        defaultValue: 0,
        type: Sequelize.FLOAT
      },
      price: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
