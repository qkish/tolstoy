'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.addColumn('users', 'posts_monets', Sequelize.INTEGER);
        queryInterface.addColumn('users', 'comments_monets', Sequelize.INTEGER);
        queryInterface.addColumn('users', 'tasks_monets', Sequelize.INTEGER);
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.removeColumn('users', 'posts_monets');
        queryInterface.removeColumn('users', 'comments_monets');
        queryInterface.removeColumn('users', 'tasks_monets');
    }
};
