const { Book } = require('../models/book.models');

class BookServices {
  static async show(idBook) {
    const results = await Book.getBookInfo(idBook);
    if(!results[0]) throw new Error('Khong tim thay');
    return results[0];
  }
}

module.exports = { BookServices };