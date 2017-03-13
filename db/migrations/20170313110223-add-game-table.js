'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'game',
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
        body: Sequelize.TEXT,

        score_1_my_ten: Sequelize.DOUBLE,
        score_1_volunteer: Sequelize.DOUBLE,
        score_1_other_ten: Sequelize.DOUBLE,
        score_1_my_ten_count: Sequelize.INTEGER,
        score_1_volunteer_count: Sequelize.INTEGER,
        score_1_other_ten_count: Sequelize.INTEGER,
        total_score_1: Sequelize.DOUBLE,

        score_2_my_ten: Sequelize.DOUBLE,
        score_2_volunteer: Sequelize.DOUBLE,
        score_2_other_ten: Sequelize.DOUBLE,
        score_2_my_ten_count: Sequelize.INTEGER,
        score_2_volunteer_count: Sequelize.INTEGER,
        score_2_other_ten_count: Sequelize.INTEGER,
        total_score_2: Sequelize.DOUBLE,

        score_3_my_ten: Sequelize.DOUBLE,
        score_3_volunteer: Sequelize.DOUBLE,
        score_3_other_ten: Sequelize.DOUBLE,
        score_3_my_ten_count: Sequelize.INTEGER,
        score_3_volunteer_count: Sequelize.INTEGER,
        score_3_other_ten_count: Sequelize.INTEGER,
        total_score_3: Sequelize.DOUBLE,

        own_score: Sequelize.DOUBLE,
        total_score: Sequelize.DOUBLE,
        score_count: Sequelize.INTEGER,
        task: Sequelize.INTEGER,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('game')
  }
}
