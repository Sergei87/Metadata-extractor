'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'book',
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        bookId: {
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
        licenseRights: {
          type: DataTypes.TEXT,
        },
        publicationDate: {
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
      }
  
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book');
  },
};
