const { Admin } = require('../models/admin.models');

class AdminServices {

  static signInWith(email, password) {
    return Admin.signIn(email, password);
  }

  static async showBooks() {
    const rawBooks = await Admin.getAllBooks()
    if(!rawBooks) throw new Error('Khong tim thay');
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
    const { id, name, image, price, amount, description, author, type, publisher } = bookInfo;
    return Admin.saveNewBook(id, name, image, price, amount, description, author, type, publisher);
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
    const { id, name, image, price, amount, description, author, type, publisher } = bookInfo;
    return Admin.updateBook(id, name, iamge, price, amount, description, author, type, publisher);
  }

  static updateOrderInfo(orderInfo) {
    const {orderId, orderStt} = orderInfo;
    return Admin.updateOrder(orderId, orderStt);
  }

  static updateAuthorInfo(authorInfo) {
    const {authorId, authorName} = authorInfo;
    return Admin.updateAuthor(authorId, authorName);
  }

  static updateCategoryInfo(catInfo) {
    const {catId, catName} = catInfo;
    return Admin.updateCategory(catId, catName);
  }

  static updatePublisherInfo(publisherInfo) {
    const {publisherId, publisherName} = publisherInfo;
    return Admin.updatePublisher(publisherId, publisherName);
  }

  static async deleteBookInfo(idBook) {
    const { bookId } = idBook
    return Admin.deleteBook(bookId);
  }
}

module.exports = { AdminServices };