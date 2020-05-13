'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('book', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      book_id: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.TEXT,
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      publisher: {
        type: DataTypes.TEXT,
      },
      language: {
        type: DataTypes.TEXT,
      },
      subjects: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      license_rights: {
        type: DataTypes.TEXT,
      },
      publication_date: {
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book');
  },
};
