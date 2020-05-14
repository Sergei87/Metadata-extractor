import db from '../conection';
import { Model, DataTypes } from 'sequelize';

export enum JobStatusEnum {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface IJobModel {
  id: string;
  bookId: number;
  status: JobStatusEnum;
}

export class JobModel extends Model {}

JobModel.init(
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
    status: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: db,
    modelName: 'BookModel',
    tableName: 'book',
  }
);
