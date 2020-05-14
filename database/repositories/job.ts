import { JobModel, IJobModel } from '../models/job';

class JobRepository {
  public async create(data: Partial<IJobModel>): Promise<any> {
    return JobModel.create(data);
  }
}

export const jobRepository = new JobRepository();
