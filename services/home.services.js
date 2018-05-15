const { Book } = require('../models/book.models');

class HomePage {
  static async show() {
    const categories = await Book.getAll('DANHMUCSACH');
    if(!categories[0]) throw new Error('Khong tim thay');

    const authors = await Book.getAll('TACGIA');
    if(!authors[0]) throw new Error('Khong tim thay');

    const publishers = await Book.getAll('NHAXUATBAN');
    if(!publishers[0]) throw new Error('Khong tim thay');

    const news = await Book.getTopNew();
    if(!publishers[0]) throw new Error('Khong tim thay');
    
    const sales = await Book.getTopSale();
    if(!publishers[0]) throw new Error('Khong tim thay');
    
    const views = await Book.getTopView();
    if(!publishers[0]) throw new Error('Khong tim thay');

    const result = { categories, authors, publishers, news, sales, views };
    return result;
  }
}

module.exports = {HomePage};