'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
	  return queryInterface.createTable(
		  'groups',
		  {
			  id: {
				  allowNull: false,
				  autoIncrement: true,
				  primaryKey: true,
				  type: Sequelize.INTEGER
			  },
			  user_id: {
				  type: Sequelize.INTEGER,
				  references: {
					  model: 'users',
					  key: 'id'
				  },
				  onUpdate: 'cascade',
				  onDelete: 'cascade'
			  },
			  type: Sequelize.ENUM('polk', 'hundred', 'ten', 'couch'),
			  money: Sequelize.INTEGER,
			  vesting: Sequelize.INTEGER,
			  created_at: {
				  allowNull: false,
				  type: Sequelize.DATE
			  },
			  updated_at: {
				  allowNull: false,
				  type: Sequelize.DATE
			  },
		  }
	  )
  },

  down: function (queryInterface, Sequelize) {
	  queryInterface.dropTable('groups')
  }
};
