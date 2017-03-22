export default (sequelize, DataTypes) => {

	const User = sequelize.define('User', {
		name: DataTypes.STRING,
		email: {type: DataTypes.STRING, unique: true},
		uid: {type: DataTypes.STRING(64)},
		first_name: DataTypes.STRING,
		last_name: DataTypes.STRING,
		birthday: DataTypes.DATE,
		gender: DataTypes.STRING(8),
		picture_small: DataTypes.STRING,
		picture_large: DataTypes.STRING,
		location_id: DataTypes.BIGINT.UNSIGNED,
		location_name: DataTypes.STRING,
		locale: DataTypes.STRING(12),
		timezone: DataTypes.INTEGER,
		remote_ip: DataTypes.STRING,
		verified: DataTypes.BOOLEAN,
		waiting_list: DataTypes.BOOLEAN,
		bot: DataTypes.BOOLEAN,
		vesting_total: DataTypes.DOUBLE,
		monets: DataTypes.INTEGER,
		money_total: DataTypes.INTEGER,
		polk: DataTypes.INTEGER,
		posts_monets: DataTypes.INTEGER,
		comments_monets: DataTypes.INTEGER,
		tasks_monets: DataTypes.INTEGER,
		ten: DataTypes.INTEGER,
		hundred: DataTypes.INTEGER,
		ten_leader: DataTypes.BOOLEAN,
		hundred_leader: DataTypes.BOOLEAN,
		polk_leader: DataTypes.BOOLEAN,
		couch: DataTypes.BOOLEAN,
		couch_group: DataTypes.INTEGER,
		current_program: DataTypes.STRING,
		approved_money: DataTypes.INTEGER,
		volunteer: DataTypes.BOOLEAN,
		target_point_a: DataTypes.STRING,
		target_point_b: DataTypes.STRING,
		posts_money: DataTypes.INTEGER,
		tasks_money: DataTypes.INTEGER,
		program_city: DataTypes.STRING
	}, {
		tableName: 'users',
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		timestamps: true,
		underscored: true,
		classMethods: {
			associate: (models) => {
				User.hasMany(models.Identity);
				User.hasMany(models.Account);
				User.hasMany(models.Group);
        User.hasMany(models.Game);
				User.hasMany(models.Feedback);
			}
		}
	})

	return User
}
