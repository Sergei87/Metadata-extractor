import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import { BookModel } from '../models/book';
import { bookRepository } from './book';

describe('Book Repository unit tests', () => {
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

      createStub = sandbox.stub(BookModel, 'create');
      createStub.resolves(createStubResult);

      actualResult = await bookRepository.create(creteRecord);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call BookModel.create once', () => {
      assert.isTrue(createStub.calledOnce);

      sinon.assert.calledWithExactly(createStub, creteRecord);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, createStubResult);
    });
  });
});
