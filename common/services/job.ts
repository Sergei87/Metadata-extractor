import { JobModel, JobStatusEnum } from '../database/models/job';
import { jobRepository } from '../database/repositories/job';

class JobService {
  public findNextJob(limit: Number): Promise<JobModel[]> {
    return jobRepository.findMany({
      where: { status: JobStatusEnum.CREATED },
      limit,
    });
  }

  public updateJobStatus(
    data: Partial<JobModel>,
    criteria: Partial<JobModel>
  ): Promise<[number, JobModel[]]> {
    return jobRepository.update(data, { where: criteria } as any);
  }
}

export const jobService = new JobService();
