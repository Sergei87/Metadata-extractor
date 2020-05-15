import { jobService } from './common/services/job';

export const FOLDER_PATH = __dirname + '/cache/epub';

jobService.createJobs(FOLDER_PATH);
