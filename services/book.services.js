const { Book } = require('../models/book.models');

class BookServices {
  static async show(idBook) {
    const results = await Book.getBookInfo(idBook);
    if(!results[0]) throw new Error('Khong tim thay');
    const book = results[0][0];
    const category = results[1][0];
    const publisher = results[2][0];
    const author = results[3][0];

    return { book, category, publisher, author };
  }
}

module.exports = { BookServices };