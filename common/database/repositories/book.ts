import { BookModel, IBookModel } from '../models/book';

class BookRepository {
  public async create(data: Partial<IBookModel>): Promise<any> {
    return BookModel.create(data);
  }
}

export const bookRepository = new BookRepository();
