'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('posts_nps', {
      // secondary keys
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'users'
        }
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'posts'
        }
      },
      //
      rating: {
        defaultValue: 0,
        type: Sequelize.FLOAT
      },
      // booleans
      is_blocked: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      // dates
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
