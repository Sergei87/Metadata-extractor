import * as fs from 'fs';
import * as _ from 'lodash';
import { JobModel, JobStatusEnum } from '../database/models/job';
import { jobRepository } from '../database/repositories/job';

export const BASE_PATH = __dirname + '/../../cache/epub';
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

  private createJobRecord(folderId: string) {
    return {
      filePath: `${BASE_PATH}/${folderId}/pg${folderId}.rdf`,
      status: JobStatusEnum.CREATED,
    };
  }

  public async createJobs(): Promise<void> {
    const folderIds = await fs.promises.readdir(BASE_PATH);

    const jobs = folderIds.map((folderId) => this.createJobRecord(folderId));

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
