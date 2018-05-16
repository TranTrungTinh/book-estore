const { Book } = require('../models/book.models');

class HomeServices {
  static async show() {
    const books = await Book.getAllCategoryAuthorPublisher();
    const categories = books[0];
    const publishers = books[1];
    const authors = books[2];
    if(!categories && !publishers && !authors) throw new Error('Khong tim thay');

    const tops = await Book.getTopNewSaleView();
    const news = tops[0];
    const sales = tops[1];
    const views = tops[2];
    if(!news && !sales && !views) throw new Error('Khong tim thay');

    return { categories, authors, publishers, news, sales, views };
  }
}

module.exports = { HomeServices };