'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'total', Sequelize.INTEGER);
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('users', 'total');
    }
};
