import { BookModel } from '../models/book';

class BookRepository {
  public async create(data: Partial<BookModel>): Promise<BookModel> {
    return BookModel.create(data);
  }
}

export const bookRepository = new BookRepository();
