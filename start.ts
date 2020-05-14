import * as fs from 'fs';
import * as _ from 'lodash';
import { JobModel, JobStatusEnum } from './common/database/models/job';

const BASE_PATH = __dirname + '/cache/epub';

const createJobs = async (dirname) => {
  const filenames = await fs.promises.readdir(dirname);

  const filesChunks = _.chunk(filenames, 1000);

  await Promise.all(
    filesChunks.map((chunk) =>
      JobModel.bulkCreate(
        chunk.map((bookId) => ({
          filePath: `${BASE_PATH}/${bookId}/pg${bookId}.rdf`,
          status: JobStatusEnum.CREATED,
        }))
      ).catch((err) => {
        console.error(err);
      })
    )
  );
};

createJobs(__dirname + `/cache/epub/`);
