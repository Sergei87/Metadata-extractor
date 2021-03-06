import { sleep } from '../common/utils';
import { jobService } from '../common/services/job';
import { JobStatusEnum, JobModel } from '../common/database/models/job';
import { parserService } from '../common/services/parser';
import { bookRepository } from '../common/database/repositories/book';

class ParserWorker {
  public async processJobs(limit) {
    const jobs = await jobService.findNextJob(limit);

    await Promise.all(jobs.map((job) => this.processJob(job)));
  }

  public async processJob(job: JobModel): Promise<void> {
    await jobService.updateJobStatus(
      { status: JobStatusEnum.IN_PROGRESS },
      { id: job.id }
    );

    let bookMetaData;

    try {
      bookMetaData = await parserService.parseRdfFile(job.filePath);
    } catch (error) {
      await jobService.updateJobStatus(
        { status: JobStatusEnum.FAILED },
        { id: job.id, errorMessage: error.message }
      );

      return;
    }
    await bookRepository.create(bookMetaData);

    await jobService.updateJobStatus(
      { status: JobStatusEnum.COMPLETED },
      { id: job.id }
    );
  }

  public async start() {
    console.log('Worker started');

    while (true) {
      await this.processJobs(20);

      await sleep(50);
    }
  }
}

export const parserWorker = new ParserWorker();
