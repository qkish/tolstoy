'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'game_scores',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        created_at: {
          type: Sequelize.DATE
        },
        updated_at: {
          type: Sequelize.DATE
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          }
        },
        game_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'game',
            key: 'id'
          }
        },
        comment: Sequelize.TEXT,
        score_1: Sequelize.DOUBLE,
        score_2: Sequelize.DOUBLE,
        score_3: Sequelize.DOUBLE
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('game_scores')
  }
}
