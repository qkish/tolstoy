export default (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        field: 'user_id'
    },
    body: DataTypes.TEXT,
    score_1: DataTypes.DOUBLE,
    score_2: DataTypes.DOUBLE,
    score_3: DataTypes.DOUBLE,
    total_score: DataTypes.DOUBLE,
  }, {
    tableName: 'feedback',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: (models) => {
        Feedback.belongsTo(models.User)
      }
    }
  })

  return Feedback
}
