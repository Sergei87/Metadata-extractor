import db from '../conection';
import { Model, DataTypes } from 'sequelize';

export class BookModel extends Model {}

BookModel.init(
  {
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
  },
  {
    sequelize: db,
    modelName: 'BookModel',
    tableName: 'book',
  }
);

// BookModel.sync({ force: true }).then(() => {
//   // Now the `users` table in the database corresponds to the model definition
//   return BookModel.create({
//     firstName: 'John',
//     lastName: 'Hancock',
//   });
// });
