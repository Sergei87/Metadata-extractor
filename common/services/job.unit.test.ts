import * as sinon from 'sinon';
import * as faker from 'faker';
import * as lodash from 'lodash';
import * as fs from 'fs';
import { assert } from 'chai';
import { jobService, CHUNK_SIZE } from './job';
import { jobRepository } from '../database/repositories/job';
import { JobStatusEnum } from '../database/models/job';

describe('JobService unit tests', () => {
  describe('#findNextJob', () => {
    let sandbox: sinon.SinonSandbox;

    let limit: number;

    let findManyResult;
    let actualResult;

    let findManyStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      limit = faker.random.number();
      findManyResult = { id: faker.random.uuid() };

      findManyStub = sandbox.stub(jobRepository, 'findMany');
      findManyStub.resolves(findManyResult);

      actualResult = await jobService.findNextJob(limit);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call jobRepository.findMany once with expected arguments', () => {
      assert.isTrue(findManyStub.calledOnce);

      sinon.assert.calledWithExactly(findManyStub, {
        where: { status: JobStatusEnum.CREATED },
        limit,
      });
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, findManyResult);
    });
  });

  describe('#updateJobStatus', () => {
    let sandbox: sinon.SinonSandbox;

    let data;
    let criteria;
    let updateResult;
    let actualResult;

    let updateStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      data = { id: faker.random.uuid() };
      criteria = { id: faker.random.uuid() };

      updateStub = sandbox.stub(jobRepository, 'update');
      updateStub.resolves(updateResult);

      actualResult = await jobService.updateJobStatus(data, criteria);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call jobRepository.update once with expected arguments', () => {
      assert.isTrue(updateStub.calledOnce);

      sinon.assert.calledWithExactly(updateStub, data, { where: criteria });
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, updateResult);
    });
  });

  describe('#creatJobRecord', () => {
    let folderId;
    let folderPath;

    let actualResult;

    before(() => {
      folderId = faker.random.number();
      folderPath = faker.random.word();

      actualResult = jobService['createJobRecord'](folderPath, folderId);
    });

    it('should return expected result', () => {
      const expectedResult = {
        filePath: `${folderPath}/${folderId}/pg${folderId}.rdf`,
        status: JobStatusEnum.CREATED,
      };

      assert.deepEqual(actualResult, expectedResult);
    });
  });

  describe('#createJobs', () => {
    let sandbox: sinon.SinonSandbox;

    let folderPath;

    let readdirResult;
    let createJobRecordResult1;
    let createJobRecordResult2;
    let chunkResult;

    let readdirStub: sinon.SinonStub;
    let createJobRecordStub: sinon.SinonStub;
    let chunkStub: sinon.SinonStub;
    let createBulkStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      folderPath = faker.random.word();

      readdirResult = [faker.random.number(), faker.random.number()];

      createJobRecordResult1 = { filePath: faker.random.uuid() };
      createJobRecordResult2 = { filePath: faker.random.uuid() };

      chunkResult = [[createJobRecordResult1], [createJobRecordResult2]];

      readdirStub = sandbox.stub(fs.promises, 'readdir');
      readdirStub.resolves(readdirResult);

      createJobRecordStub = sandbox.stub(jobService as any, 'createJobRecord');
      createJobRecordStub.onCall(0).returns(createJobRecordResult1);
      createJobRecordStub.onCall(1).returns(createJobRecordResult2);

      chunkStub = sandbox.stub(lodash, 'chunk');
      chunkStub.returns(chunkResult);

      createBulkStub = sandbox.stub(jobRepository, 'createBulk');

      await jobService.createJobs(folderPath);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call readdir once', () => {
      assert.isTrue(readdirStub.calledOnce);

      sinon.assert.calledWithExactly(readdirStub, folderPath);
    });

    it('should call createJobRecord N times', () => {
      assert.strictEqual(createJobRecordStub.callCount, readdirResult.length);

      sinon.assert.calledWithExactly(
        createJobRecordStub.getCall(0),
        folderPath,
        readdirResult[0]
      );

      sinon.assert.calledWithExactly(
        createJobRecordStub.getCall(1),
        folderPath,
        readdirResult[1]
      );
    });

    it('should call lodash chunk once', () => {
      assert.isTrue(chunkStub.calledOnce);

      sinon.assert.calledWithExactly(
        chunkStub,
        [createJobRecordResult1, createJobRecordResult2],
        CHUNK_SIZE
      );
    });

    it('should call createBulk N times', () => {
      assert.strictEqual(createBulkStub.callCount, chunkResult.length);

      sinon.assert.calledWithExactly(createBulkStub.getCall(0), chunkResult[0]);

      sinon.assert.calledWithExactly(createBulkStub.getCall(1), chunkResult[1]);
    });
  });
});
