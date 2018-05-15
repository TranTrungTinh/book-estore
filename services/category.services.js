const { Book } = require('../models/book.models');

class CategoryServices {
  static async showBookWithIDCategory(currentPage, idCategory) {
    const books = await Book.getAllCategoryAuthorPublisher();
    const categories = books[0];
    const publishers = books[1];
    const authors = books[2];
    if(!categories && !publishers && !authors) throw new Error('Khong tim thay');

    const items = await Book.getBookWithIDCategory(currentPage, idCategory);
    if(!items[0] && !items[1]) throw new Error('Khong tim thay');
    const count = Math.ceil(items[0][0].count / 8);
    return {categories, authors, publishers, items: items[1], count};
  }

  static async showBookWithIDAuthor(idAuthor) {
    const books = await Book.getAllCategoryAuthorPublisher();
    const categories = books[0];
    const publishers = books[1];
    const authors = books[2];
    if(!categories && !publishers && !authors) throw new Error('Khong tim thay');

    const items = await Book.getBookWithIDAuthor(idAuthor);
    if(!items[0]) throw new Error('Khong tim thay');

    return {categories, authors, publishers, items};
  } 

  static async showBookWithIDPublisher(idPublisher) {
    const books = await Book.getAllCategoryAuthorPublisher();
    const categories = books[0];
    const publishers = books[1];
    const authors = books[2];
    if(!categories && !publishers && !authors) throw new Error('Khong tim thay');

    const items = await Book.getBookWithIDPublisher(idPublisher);
    if(!items[0]) throw new Error('Khong tim thay');

    return {categories, authors, publishers, items};
  } 
}

module.exports = { CategoryServices };