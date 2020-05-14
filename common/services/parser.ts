import * as fs from 'fs';
import { Parser } from 'xml2js';
import * as _ from 'lodash';
import { IBookModel } from '../database/models/book';

class ParserService {
  private xmlParser = new Parser();

  public async readRdfFile(filePath: string) {
    return fs.promises.readFile(filePath);
  }

  public async convertXmlTOJson(xml) {
    return this.xmlParser.parseStringPromise(xml);
  }

  public extractMetadata(metaData): IBookModel {
    const bookMeta = metaData['rdf:RDF']['pgterms:ebook'][0];

    let result = {
      bookId: _.get(bookMeta, '$.rdf:about').replace('ebooks/', ''),
      title: _.get(bookMeta, 'dcterms:title[0]'),
      publisher: _.get(bookMeta, 'dcterms:publisher[0]'),
      authors: this.getAuthors(bookMeta),
      subjects: this.getSubjects(bookMeta),
      language: _.get(
        bookMeta,
        'dcterms:language[0].rdf:Description[0].rdf:value[0]._'
      ),
      licenseRights: _.get(bookMeta, 'dcterms:rights[0]'),
      publicationDate: _.get(bookMeta, 'dcterms:issued[0]._'),
    } as IBookModel;

    return result;
  }

  protected getAuthors(bookMetaData): string[] {
    const authors = _.get(bookMetaData, 'dcterms:creator');

    if (!authors) return null;

    return authors.map((author) =>
      _.get(author, 'pgterms:agent[0].pgterms:name[0]')
    );
  }

  protected getSubjects(bookMetaData): string[] {
    const authors = _.get(bookMetaData, 'dcterms:subject');

    if (!authors) return null;

    return authors.map((author) =>
      _.get(author, 'rdf:Description[0].rdf:value[0]')
    );
  }

  public async parseRdfFile(filePath) {
    let xml = await this.readRdfFile(filePath);

    const fileMeta = await this.convertXmlTOJson(xml);

    return this.extractMetadata(fileMeta);
  }
}

export const parserService = new ParserService();
