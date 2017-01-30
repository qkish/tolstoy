'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'last_total_transaction', Sequelize.DATE);
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('users', 'last_total_transaction');
    }
};
