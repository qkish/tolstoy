'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('programs_posts', {
      // secondary keys
      program_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'programs'
        }
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'posts'
        }
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
