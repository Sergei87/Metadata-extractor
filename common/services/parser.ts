import * as fs from 'fs';
import { Parser } from 'xml2js';
import * as _ from 'lodash';
import { BookModel } from '../database/models/book';

class ParserService {
  public xmlParser = new Parser();

  public async readFile(filePath: string) {
    return fs.promises.readFile(filePath);
  }

  public async convertXmlTOJson(xml) {
    return this.xmlParser.parseStringPromise(xml);
  }

  public extractMetadata(metaData): Partial<BookModel> {
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
    };

    return result;
  }

  private getAuthors(bookMetaData): string[] {
    const authors = _.get(bookMetaData, 'dcterms:creator');

    if (!authors) return null;

    return authors.map((author) =>
      _.get(author, 'pgterms:agent[0].pgterms:name[0]')
    );
  }

  private getSubjects(bookMetaData): string[] {
    const subjects = _.get(bookMetaData, 'dcterms:subject');

    if (!subjects) return null;

    return subjects.map((subject) =>
      _.get(subject, 'rdf:Description[0].rdf:value[0]')
    );
  }

  public async parseRdfFile(filePath) {
    let content = await this.readFile(filePath);

    const fileMeta = await this.convertXmlTOJson(content);

    return this.extractMetadata(fileMeta);
  }
}

export const parserService = new ParserService();
