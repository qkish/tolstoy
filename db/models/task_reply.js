module.exports = function (sequelize, DataTypes) {
  var TaskReply = sequelize.define('TaskReply', {
    url: DataTypes.STRING,
    username: DataTypes.STRING,
    status: DataTypes.INTEGER,
    volunteer: DataTypes.INTEGER,
    program: DataTypes.STRING,
    money: DataTypes.INTEGER,
    tags: DataTypes.STRING,
    created: DataTypes.DATE,
    permlink: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    tableName: 'task_replies',
    timestamps: false,
    underscored: true
  });
  return TaskReply;
};
