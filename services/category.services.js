const { Book } = require('../models/book.models');

class CategoryServices {
  static async showBookWithIDCategory(idCategory) {
    const categories = await Book.getAll('DANHMUCSACH');
    if(!categories[0]) throw new Error('Khong tim thay');

    const authors = await Book.getAll('TACGIA');
    if(!authors[0]) throw new Error('Khong tim thay');

    const publishers = await Book.getAll('NHAXUATBAN');
    if(!publishers[0]) throw new Error('Khong tim thay');

    const items = await Book.getBookWithIDCategory(idCategory);
    if(!items[0]) throw new Error('Khong tim thay');

    return {categories, authors, publishers, items};
  } 
}

module.exports = { CategoryServices };