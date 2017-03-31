export default (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        field: 'user_id'
    },
    body: DataTypes.TEXT,
    money: DataTypes.INTEGER,
    score_1_my_ten: DataTypes.DOUBLE,
    score_1_volunteer: DataTypes.DOUBLE,
    score_1_other_ten: DataTypes.DOUBLE,
    score_1_my_ten_count: DataTypes.INTEGER,
    score_1_volunteer_count: DataTypes.INTEGER,
    score_1_other_ten_count: DataTypes.INTEGER,
    total_score_1: DataTypes.DOUBLE,

    score_2_my_ten: DataTypes.DOUBLE,
    score_2_volunteer: DataTypes.DOUBLE,
    score_2_other_ten: DataTypes.DOUBLE,
    score_2_my_ten_count: DataTypes.INTEGER,
    score_2_volunteer_count: DataTypes.INTEGER,
    score_2_other_ten_count: DataTypes.INTEGER,
    total_score_2: DataTypes.DOUBLE,

    score_3_my_ten: DataTypes.DOUBLE,
    score_3_volunteer: DataTypes.DOUBLE,
    score_3_other_ten: DataTypes.DOUBLE,
    score_3_my_ten_count: DataTypes.INTEGER,
    score_3_volunteer_count: DataTypes.INTEGER,
    score_3_other_ten_count: DataTypes.INTEGER,
    total_score_3: DataTypes.DOUBLE,

    own_score: DataTypes.DOUBLE,
    total_score: DataTypes.DOUBLE,
    score_count: DataTypes.INTEGER,
    task: DataTypes.INTEGER
  }, {
    tableName: 'game',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: (models) => {
        Game.belongsTo(models.User)
        Game.hasMany(models.GameScore)
      }
    }
  })

  return Game
}
