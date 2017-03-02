module.exports = function (sequelize, DataTypes) {
  var TaskReply = sequelize.define('TaskReply', {
    url: DataTypes.STRING,
    username: DataTypes.STRING,
    status: DataTypes.INTEGER,
    program: DataTypes.STRING,
    volunteer: {
      type: DataTypes.INTEGER,
      references: {
          model: 'users',
          key: 'id'
      },
      field: 'volunteer_id'
    }
  }, {
    tableName: 'task_replies',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
    underscored: true,
    classMethods: {
      associate: function (models) {
        TaskReply.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Account;
};
