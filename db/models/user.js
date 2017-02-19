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
		last_total_transaction: DataTypes.DATEONLY,
		total: DataTypes.DOUBLE,
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
		volunteer: DataTypes.BOOLEAN
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
			}
		},
		hooks: {
			beforeUpdate: ({dataValues: values = {}}, options) => {
				const {models: { Group }} = sequelize
				const {
					id: userId,
					money_total: moneyTotal,
					ten_leader: tenLeader,
					hundred_leader: hundredLeader,
					polk_leader: polkLeader,
					couch_group: couchGroup,
				} = values
				
				const leadersType = ['ten', 'hundred', 'polk', 'couch']
				const leadersId = [tenLeader, hundredLeader, polkLeader, couchGroup]
				const leaders = leadersId
					.map((i, idx) => ({type: leadersType[idx], id: i}) )
					.filter(i => i.id)
				const userMoney = Number(moneyTotal)
				if (userMoney) {
					// TODO Оптимизировать до двух запросов к базе (findAll => bulkUpdate/Create)
					leaders.forEach( leader => {
						User.findAll({
							attributes: ['id', 'money_group'],
							where: {
								id: leadersId
							}
						}).then(users => {
							// Bulk update
						})
						
						Group.findOne({
							attributes: ['id', 'user_id', 'type'],
							where: {
								user_id: leader.id,
								type: leader.type
							}
						}).then( group => {
							try {
								const {dataValues: {id, money}} = group
								Group.update({
									money: userMoney + (Number(money) ? Number(money) : 0)
								}, {
									where: {
										id: id
									}
								})
							} catch (e) {
								Group.create({
									user_id: leader.id,
									type: leader.type,
									money: userMoney
								})
							}
						})
					})
				}
			},
		}
	})
	
	return User
}
