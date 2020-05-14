import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import { JobModel } from '../models/job';
import { jobRepository } from './job';

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
});
