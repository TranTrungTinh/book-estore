const { Admin } = require('../models/admin.models');

const ITEMS_PER_PAGE = 8

class AdminServices {

  static signInWith(email, password) {
    return Admin.signIn(email, password);
  }

  static async showBooks() {
    const rawBooks = await Admin.getAllBooks()
    
    if(!rawBooks) throw new Error('Khong tim thay');
    // console.log(rawBooks);
    // var books = []
    // for (let i = 0; i < rawBooks.length; i++) {
    //   books.push(rawBooks[i])
    // }
    return { books: rawBooks };
  }

  static async showOrders() {
    const orders = await Admin.getAllOrders()
    if(!orders) throw new Error('Khong tim thay')

    return { orders }
  }

  static async showAuthors() {
    const authors = await Admin.getAllAuthors();
    if(!authors) throw new Error('Khong tim thay');

    return { authors };
  }

  static async showCategories() {
    const cats = await Admin.getAllCategories();
    if(!cats) throw new Error('Khong tim thay');

    return { cats };
  }

  static async showPublishers() {
    const publishers = await Admin.getAllPublishers();
    if(!publishers) throw new Error('Khong tim thay');

    return { publishers };
  }
  
  static saveBook(bookInfo) {
    const { name, price, inventory, description, authorId, catId, publisherId } = bookInfo;
    return Admin.saveMewBook(name, price, inventory, description, authorId, catId, publisherId);
  }

  static saveAuthor(authorName) {
    return Admin.saveNewAuthor(authorName);
  }

  static saveCategory(catName) {
    return Admin.saveNewCategory(catName);
  }

  static savePublisher(publisherName) {
    return Admin.saveNewPublisher(publisherName);
  }

  static updateBookInfo(bookInfo) {
    const { id, name, price, inventory, description, authorId, catId, publisherId } = bookInfo;
    return Admin.updateBook(id, name, price, inventory, description, authorId, catId, publisherId);
  }

  static updateAuthorInfo(authorInfo) {
    const {id, name} = authorInfo;
    return Admin.updateAuthor(id, name);
  }

  static updateCategoryInfo(catInfo) {
    const {id, name} = catInfo;
    return Admin.updateCategory(id, name);
  }

  static updatePublisherInfo(publisherInfo) {
    const {id, name} = publisherInfo;
    return Admin.updatePublisher(id, name);
  }

  static deleteBookInfo(idBook) {
    return Admin.deleteBook(idBook);
  }
}

module.exports = { AdminServices };