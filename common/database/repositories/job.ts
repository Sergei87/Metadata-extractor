import { JobModel } from '../models/job';
import { UpdateOptions } from 'sequelize/types';

class JobRepository {
  public async create(data: Partial<JobModel>): Promise<JobModel> {
    return JobModel.create(data);
  }

  public async findMany(condition: Object): Promise<JobModel[]> {
    return JobModel.findAll(condition);
  }

  public async update(
    data: Partial<JobModel>,
    criteria: UpdateOptions
  ): Promise<[number, JobModel[]]> {
    return JobModel.update(data, criteria);
  }

  public createBulk(jobs: Partial<JobModel>[]): Promise<JobModel[]> {
    return JobModel.bulkCreate(jobs);
  }
}

export const jobRepository = new JobRepository();
