import * as fs from 'fs';
import * as _ from 'lodash';
import { JobModel, JobStatusEnum } from '../database/models/job';
import { jobRepository } from '../database/repositories/job';

export const CHUNK_SIZE = 1000;

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

  private createJobRecord(folderPath: string, folderId: string) {
    return {
      filePath: `${folderPath}/${folderId}/pg${folderId}.rdf`,
      status: JobStatusEnum.CREATED,
    };
  }

  public async createJobs(folderPath): Promise<void> {
    const folderIds = await fs.promises.readdir(folderPath);

    const jobs = folderIds.map((folderId) =>
      this.createJobRecord(folderPath, folderId)
    );

    const jobChunks = _.chunk(jobs, CHUNK_SIZE);

    await Promise.all(
      jobChunks.map(async (bulkJobs) => {
        let result;
        try {
          result = await jobRepository.createBulk(bulkJobs);
        } catch (error) {
          console.error(error);
        }

        return result;
      })
    );
  }
}

export const jobService = new JobService();
