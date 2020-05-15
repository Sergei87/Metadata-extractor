import db from '../conection';
import { Model, DataTypes } from 'sequelize';

export enum JobStatusEnum {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class JobModel extends Model {
  public id!: string;
  public filePath!: string;
  public status!: JobStatusEnum;
  public errorMessage: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JobModel.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    filePath: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TEXT,
    },
    errorMessage: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: db,
    modelName: 'JobModel',
    tableName: 'job',
  }
);
