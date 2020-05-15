import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import { parserService } from '../common/services/parser';
import { jobService } from '../common/services/job';
import { parserWorker } from './parser-worker';
import { JobStatusEnum } from '../common/database/models/job';
import { bookRepository } from '../common/database/repositories/book';

describe('ParserWorker unit test', () => {
  describe('#processJob', () => {
    let sandbox: sinon.SinonSandbox;

    let job;

    let parseRdfFileResult;

    let updateJobStatusStub: sinon.SinonStub;
    let parseRdfFileStub: sinon.SinonStub;
    let createStub: sinon.SinonStub;

    before(() => {
      sandbox = sinon.createSandbox();

      job = { id: faker.random.uuid(), filePath: faker.random.word() };
      parseRdfFileResult = { id: faker.random.uuid() };

      updateJobStatusStub = sandbox.stub(jobService, 'updateJobStatus');

      parseRdfFileStub = sandbox.stub(parserService, 'parseRdfFile');

      createStub = sandbox.stub(bookRepository, 'create');
    });

    after(() => {
      sandbox.restore();
    });

    context('when file successfully parsed', () => {
      before(async () => {
        parseRdfFileStub.resolves(parseRdfFileResult);

        await parserWorker.processJob(job);
      });

      after(() => {
        sandbox.reset();
      });

      it('should call updateJobStatus twice with expected arguments', () => {
        assert.isTrue(updateJobStatusStub.calledTwice);

        sinon.assert.calledWithExactly(
          updateJobStatusStub.getCall(0),
          { status: JobStatusEnum.IN_PROGRESS },
          { id: job.id }
        );

        sinon.assert.calledWithExactly(
          updateJobStatusStub.getCall(1),
          { status: JobStatusEnum.COMPLETED },
          { id: job.id }
        );
      });

      it('should call parseRdfFile once with expected arguments', () => {
        assert.isTrue(parseRdfFileStub.calledOnce);

        sinon.assert.calledWithExactly(parseRdfFileStub, job.filePath);
      });

      it('should call bookRepository.create once with expected arguments', () => {
        assert.isTrue(createStub.calledOnce);

        sinon.assert.calledWithExactly(createStub, parseRdfFileResult);
      });
    });

    context('when file parsing failed', () => {
      before(async () => {
        parseRdfFileStub.rejects(new Error('failed job'));

        await parserWorker.processJob(job);
      });

      after(() => {
        sandbox.reset();
      });

      it('should call updateJobStatus twice with expected arguments', () => {
        assert.isTrue(updateJobStatusStub.calledTwice);

        sinon.assert.calledWithExactly(
          updateJobStatusStub.getCall(0),
          { status: JobStatusEnum.IN_PROGRESS },
          { id: job.id }
        );

        sinon.assert.calledWithExactly(
          updateJobStatusStub.getCall(1),
          { status: JobStatusEnum.FAILED },
          { id: job.id, errorMessage: 'failed job' }
        );
      });

      it('should call parseRdfFile once with expected arguments', () => {
        assert.isTrue(parseRdfFileStub.calledOnce);

        sinon.assert.calledWithExactly(parseRdfFileStub, job.filePath);
      });

      it('should not call bookRepository.create', () => {
        assert.isTrue(createStub.notCalled);
      });
    });
  });

  describe('#processJobs', () => {
    let sandbox: sinon.SinonSandbox;

    let limit = 2;

    let findManyResult;

    let findManyStub: sinon.SinonStub;
    let processJobStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      findManyResult = [
        { id: faker.random.uuid() },
        { id: faker.random.uuid() },
      ];

      findManyStub = sandbox.stub(jobService, 'findNextJob');
      findManyStub.resolves(findManyResult);

      processJobStub = sandbox.stub(parserWorker, 'processJob');

      await parserWorker.processJobs(limit);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call jobService.findNextJob once with expected arguments', () => {
      assert.isTrue(findManyStub.calledOnce);

      sinon.assert.calledWithExactly(findManyStub, limit);
    });

    it('should call processJob N times', () => {
      assert.strictEqual(processJobStub.callCount, findManyResult.length);

      sinon.assert.calledWithExactly(
        processJobStub.getCall(0),
        findManyResult[0]
      );

      sinon.assert.calledWithExactly(
        processJobStub.getCall(1),
        findManyResult[1]
      );
    });
  });
});
