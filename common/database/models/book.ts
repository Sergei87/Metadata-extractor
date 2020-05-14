import db from '../conection';
import { Model, DataTypes } from 'sequelize';

export interface IBookModel {
  id: string;
  bookId: number;
  title: string;
  authors: string[];
  publisher: string;
  language: string;
  subjects: string[];
  licenseRights: string;
  publicationDate: Date;
}

export class BookModel extends Model {}

BookModel.init(
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
  },
  {
    sequelize: db,
    modelName: 'BookModel',
    tableName: 'book',
  }
);
