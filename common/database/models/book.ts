import db from '../conection';
import { Model, DataTypes } from 'sequelize';

export class BookModel extends Model {
  public id!: string;
  public bookId!: number;
  public title!: string;
  public authors!: string[];
  public publisher!: string;
  public language!: string;
  public subjects!: string[];
  public licenseRights!: string;
  public publicationDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    indexes: [
      {
        name: 'authors_index',
        fields: ['authors'],
        using: 'gin',
      },
      {
        name: 'title_index',
        fields: ['title'],
        using: 'btree',
      },
    ],
  }
);
