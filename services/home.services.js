const { Book } = require('../models/book.models');

class HomePage {
  static async show() {
    const categories = await Book.getAll('DANHMUCSACH');
    if(!categories[0]) throw new Error('Khong tim thay');
    const authors = await Book.getAll('TACGIA');
    if(!authors[0]) throw new Error('Khong tim thay');
    const publishers = await Book.getAll('NHAXUATBAN');
    if(!publishers[0]) throw new Error('Khong tim thay');
    const result = { categories, authors, publishers };
    return result;
  }
}

module.exports = {HomePage};