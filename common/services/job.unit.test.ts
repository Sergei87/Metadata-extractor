import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import { jobService } from './job';
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
});
