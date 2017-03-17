export default (sequelize, DataTypes) => {

	const Group = sequelize.define('Group', {
		UserId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'users',
				key: 'id'
			},
			field: 'user_id',
		},
		type: DataTypes.ENUM(['polk', 'hundred', 'ten', 'couch']),
		money: DataTypes.INTEGER,
		vesting: DataTypes.INTEGER,
		monets: DataTypes.INTEGER,
		total_score: DataTypes.DOUBLE
	}, {
		// TODO: Move createdAt, updatedAt, timestamps, underscored to global Sequelize define
		tableName: 'groups',
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		timestamps: true,
		underscored: true,
		classMethods: {
			associate: (models) => {
				Group.belongsTo(models.User, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: false
					},
				})
			}
		}
	})

	return Group
}
