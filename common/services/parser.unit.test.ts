import * as sinon from 'sinon';
import * as faker from 'faker';
import { assert } from 'chai';
import * as fs from 'fs';
import { parserService } from './parser';
import { parse } from 'querystring';

const fakeRDfMetadata = {
  'rdf:RDF': {
    'pgterms:ebook': [
      {
        $: {
          'rdf:about': 'ebooks/9',
        },
        'dcterms:publisher': ['Project Gutenberg'],
        'dcterms:title': ["Abraham Lincoln's First Inaugural Address"],
        'dcterms:subject': [
          {
            'rdf:Description': [
              {
                'rdf:value': [
                  'Presidents -- United States -- Inaugural addresses',
                ],
              },
            ],
          },
          {
            'rdf:Description': [
              {
                'rdf:value': ['E456'],
              },
            ],
          },
          {
            'rdf:Description': [
              {
                'rdf:value': [
                  'United States -- Politics and government -- 1861-1865',
                ],
              },
            ],
          },
        ],
        'dcterms:language': [
          {
            'rdf:Description': [
              {
                'rdf:value': [
                  {
                    _: 'en',
                  },
                ],
              },
            ],
          },
        ],
        'dcterms:issued': [
          {
            _: '1979-12-01',
          },
        ],
        'dcterms:rights': ['Public domain in the USA.'],
        'dcterms:creator': [
          {
            'pgterms:agent': [
              {
                'pgterms:name': ['Lincoln, Abraham'],
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('ParserService unit tests', () => {
  describe('#readRdfFile', () => {
    let sandbox: sinon.SinonSandbox;

    let filePath;
    let readFileResult;
    let actualResult;

    let readFileStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();
      filePath = faker.random.uuid();

      readFileResult = faker.random.uuid();

      readFileStub = sandbox.stub(fs.promises, 'readFile');
      readFileStub.resolves(readFileResult);

      actualResult = await parserService.readFile(filePath);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call readFile once with expected arguments', () => {
      assert.isTrue(readFileStub.calledOnce);

      sinon.assert.calledWithExactly(readFileStub, filePath);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, readFileResult);
    });
  });

  describe('#convertXmlTOJson', () => {
    let sandbox: sinon.SinonSandbox;

    let xml;
    let parseStringPromiseResult;
    let actualResult;

    let parseStringPromiseStub: sinon.SinonStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      xml = faker.random.uuid();
      parseStringPromiseResult = { id: faker.random.uuid() };

      parseStringPromiseStub = sandbox.stub(
        parserService.xmlParser,
        'parseStringPromise'
      );
      parseStringPromiseStub.resolves(parseStringPromiseResult);

      actualResult = await parserService.convertXmlTOJson(xml);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call parseStringPromise once', () => {
      assert.isTrue(parseStringPromiseStub.calledOnce);
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, parseStringPromiseResult);
    });
  });

  describe('#extractMetadata', () => {
    let sandbox: sinon.SinonSandbox;

    let rdfMetadata;
    let actualResult;

    before(async () => {
      sandbox = sinon.createSandbox();

      rdfMetadata = fakeRDfMetadata;

      actualResult = await parserService.extractMetadata(rdfMetadata);
    });

    after(() => {
      sandbox.restore();
    });

    it('should return expected result', () => {
      const expectedResult = {
        bookId: '9',
        title: "Abraham Lincoln's First Inaugural Address",
        publisher: 'Project Gutenberg',
        authors: ['Lincoln, Abraham'],
        subjects: [
          'Presidents -- United States -- Inaugural addresses',
          'E456',
          'United States -- Politics and government -- 1861-1865',
        ],
        language: 'en',
        licenseRights: 'Public domain in the USA.',
        publicationDate: '1979-12-01',
      };

      assert.deepEqual(actualResult, expectedResult);
    });
  });

  describe('#getAuthors', () => {
    const fakeData = fakeRDfMetadata['rdf:RDF']['pgterms:ebook'][0];
    let actualResult;

    context('when authors exists', () => {
      before(() => {
        actualResult = parserService['getAuthors'](fakeData);
      });

      it('should return expected result', () => {
        const expectedResult = ['Lincoln, Abraham'];

        assert.deepEqual(actualResult, expectedResult);
      });
    });

    context('when authors does not exist', () => {
      before(() => {
        actualResult = parserService['getAuthors']({});
      });

      it('should return expected result', () => {
        assert.isNull(actualResult);
      });
    });
  });

  describe('#getSubjects', () => {
    const fakeData = fakeRDfMetadata['rdf:RDF']['pgterms:ebook'][0];
    let actualResult;

    context('when authors exists', () => {
      before(() => {
        actualResult = parserService['getSubjects'](fakeData);
      });

      it('should return expected result', () => {
        const expectedResult = [
          'Presidents -- United States -- Inaugural addresses',
          'E456',
          'United States -- Politics and government -- 1861-1865',
        ];

        assert.deepEqual(actualResult, expectedResult);
      });
    });

    context('when authors does not exist', () => {
      before(() => {
        actualResult = parserService['getSubjects']({});
      });

      it('should return expected result', () => {
        assert.isNull(actualResult);
      });
    });
  });

  describe('#parseRdfFile', () => {
    let sandbox: sinon.SinonSandbox;

    let filePath;

    let readFileResult;
    let convertXmlTOJsonResult;
    let extractMetadataResult;
    let actualResult;

    let readFileStub;
    let convertXmlTOJsonStub;
    let extractMetadataStub;

    before(async () => {
      sandbox = sinon.createSandbox();

      filePath = faker.random.uuid();

      readFileStub = sandbox.stub(parserService, 'readFile');
      readFileStub.resolves(readFileResult);

      convertXmlTOJsonStub = sandbox.stub(parserService, 'convertXmlTOJson');
      convertXmlTOJsonStub.resolves(convertXmlTOJsonResult);

      extractMetadataStub = sandbox.stub(parserService, 'extractMetadata');
      extractMetadataStub.resolves(extractMetadataResult);

      await parserService.parseRdfFile(filePath);
    });

    after(() => {
      sandbox.restore();
    });

    it('should call readFile once with expected arguments', () => {
      assert.isTrue(readFileStub.calledOnce);

      sinon.assert.calledWithExactly(readFileStub, filePath);
    });

    it('should call convertXmlTOJson once with expected arguments', () => {
      assert.isTrue(convertXmlTOJsonStub.calledOnce);

      sinon.assert.calledWithExactly(convertXmlTOJsonStub, readFileResult);
    });

    it('should call extractMetadata once with expected arguments', () => {
      assert.isTrue(extractMetadataStub.calledOnce);

      sinon.assert.calledWithExactly(
        extractMetadataStub,
        convertXmlTOJsonResult
      );
    });

    it('should return expected result', () => {
      assert.strictEqual(actualResult, extractMetadataResult);
    });
  });
});
