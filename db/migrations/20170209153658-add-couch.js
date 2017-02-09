'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'couch', Sequelize.BOOLEAN);
        queryInterface.addColumn('users', 'couch_group', Sequelize.INTEGER);
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('users', 'couch');
        queryInterface.removeColumn('users', 'couch_group');
    }
};
