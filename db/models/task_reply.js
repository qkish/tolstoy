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
      }
    }
  }, {
    tableName: 'task_replies',
    timestamps: false,
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
  return TaskReply;
};
