import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import { JobModel, JobStatusEnum } from '../models/job';
import { jobRepository } from './job';
import { jobService } from 'common/services/job';
import { accessSync } from 'fs';

describe('Job Repository unit tests', () => {
  describe('#create', () => {
    let sandbox: sinon.SinonSandbox;

    let createStub: sinon.SinonStub;

    let actualResult;
    let creteRecord;
    let createStubResult;

    before(async () => {
      sandbox = sinon.createSandbox();

      creteRecord = {
        id: faker.random.uuid(),
        bookId: faker.random.number(),
      };

      createStubResult = { id: faker.random.uuid() };

      createStub = sandbox.stub(JobModel, 'create');
      createStub.resolves(createStubResult);

      actualResult = await jobRepository.create(creteRecord);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call JobModel.create once', () => {
      assert.isTrue(createStub.calledOnce);

      sinon.assert.calledWithExactly(createStub, creteRecord);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, createStubResult);
    });
  });

  describe('#findMany', () => {
    let sandbox: sinon.SinonSandbox;

    let condition;
    let actualResult;
    let findAllResult;

    let findAllStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      condition = { id: faker.random.uuid };
      findAllResult = { id: faker.random.uuid };

      findAllStub = sandbox.stub(JobModel, 'findAll');
      findAllStub.resolves(findAllResult);

      actualResult = await jobRepository.findMany(condition);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call JobModel.findAll once with expected arguments', () => {
      assert.isTrue(findAllStub.calledOnce);

      sinon.assert.calledWithExactly(findAllStub, condition);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, findAllResult);
    });
  });

  describe('#update', () => {
    let sandbox: sinon.SinonSandbox;

    let updateData;
    let updataCreteria;

    let actualResult;
    let expectedResult;

    let updateStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      updateData = {
        status: JobStatusEnum.CREATED,
      };

      updataCreteria = {
        where: { id: faker.random.uuid() },
      };
      expectedResult = {};

      updateStub = sandbox.stub(JobModel, 'update');
      updateStub.resolves(expectedResult);

      actualResult = await jobRepository.update(updateData, updataCreteria);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call JobModel.update once', () => {
      assert.isTrue(updateStub.calledOnce);

      sinon.assert.calledWithExactly(updateStub, updateData, updataCreteria);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, expectedResult);
    });
  });
});
