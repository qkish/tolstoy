'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // secondary keys
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'users'
        }
      },
      // strings
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        defaultValue: 'user-feed',
        type: Sequelize.STRING
      },
      // booleans
      is_blocked: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      is_visible: {
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      // dates
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
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
