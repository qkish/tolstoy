'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'desyatka', Sequelize.INTEGER);
        queryInterface.addColumn('users', 'sotnya', Sequelize.INTEGER);
        queryInterface.addColumn('users', 'desyatnik', Sequelize.BOOLEAN);
        queryInterface.addColumn('users', 'sotnik', Sequelize.BOOLEAN);
        queryInterface.addColumn('users', 'polkovodec', Sequelize.BOOLEAN);
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('users', 'desyatka');
        queryInterface.removeColumn('users', 'sotnya');
        queryInterface.removeColumn('users', 'desyatnik');
        queryInterface.removeColumn('users', 'sotnik');
        queryInterface.removeColumn('users', 'polkovodec');
    }
};
