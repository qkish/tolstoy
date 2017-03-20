export default (sequelize, DataTypes) => {
  const GameScore = sequelize.define('GameScore', {
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    GameId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'game',
        key: 'id'
      },
      field: 'game_id'
    },
    score_1: DataTypes.DOUBLE,
    score_2: DataTypes.DOUBLE,
    score_3: DataTypes.DOUBLE,
    comment: DataTypes.TEXT
  }, {
    tableName: 'game_scores',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: (models) => {
        GameScore.belongsTo(models.User),
        GameScore.belongsTo(models.Game)
      }
    }
  })

  return GameScore
}
