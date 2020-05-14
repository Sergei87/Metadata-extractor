'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('book', {
      fields: ['authors'], // <-- name = field name, gin_trgm_ops comes after the field name
      using: 'gin',
      indexName: 'book_authors_gin_trgm_idx', // specify the index name manually otherwise sequelize will create party_
      unique: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('book', 'book_authors_gin_trgm_idx');
  },
};
