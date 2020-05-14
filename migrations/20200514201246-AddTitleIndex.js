'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('book', {
      fields: ['title'],
      indexName: 'book_title_idx',
      unique: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('book', 'book_title_idx');
  },
};
