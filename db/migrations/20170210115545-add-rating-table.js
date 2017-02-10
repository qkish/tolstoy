'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      queryInterface.createTable(
          'rating',
          {
              id: {
                  type: Sequelize.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              group_id: Sequelize.INTEGER,
              type: Sequelize.ENUM('polk', 'hundred', 'ten', 'couch_group'),
              vesting: Sequelize.INTEGER,
              money: Sequelize.INTEGER
          }
      )
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.dropTable('rating')
  }
};
