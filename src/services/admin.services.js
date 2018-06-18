const { Admin } = require('../models/admin.models');

const ITEMS_PER_PAGE = 8

class AdminServices {

  static signInWith(email, password) {
    return Admin.signIn(email, password);
  }

  static async showBooks() {
    const rawBooks = await Admin.getAllBooks()
    
    if(!rawBooks) throw new Error('Khong tim thay')
    var books = []
    for (let i = 0; i < rawBooks.length; i++) {
      books.push(rawBooks[i])
    }

    return { books }
  }

  static async showOrders() {
    const orders = await Admin.getAllOrders()
    if(!orders) throw new Error('Khong tim thay')

    return { orders }
  }

  static async showAuthors() {
    const authors = await Admin.getAllAuthors()
    if(!authors) throw new Error('Khong tim thay')

    return { authors }
  }

  static async showCategories() {
    const cats = await Admin.getAllCategories()
    if(!cats) throw new Error('Khong tim thay')

    return { cats }
  }

  static async showPublishers() {
    const publishers = await Admin.getAllPublishers()
    if(!publishers) throw new Error('Khong tim thay')

    return { publishers }
  }
  
  static async saveBook(bookInfo) {
    const { name, price, inventory, description, authorId, catId, publisherId } = bookInfo
    return Admin.saveMewBook(name, price, inventory, description, authorId, catId, publisherId)
  }

  static async saveAuthor(authorName) {
    return Admin.saveNewAuthor(authorName)
  }

  static async saveCategory(catName) {
    return Admin.saveNewCategory(catName)
  }

  static async savePublisher(publisherName) {
    return Admin.saveNewPublisher(publisherName)
  }

  static async updateBookInfo(bookInfo) {
    const { id, name, price, inventory, description, authorId, catId, publisherId } = bookInfo
    return Admin.updateBook(id, name, price, inventory, description, authorId, catId, publisherId)
  }

  static async updateAuthorInfo(authorInfo) {
    const {id, name} = authorInfo
    return Admin.updateAuthor(id, name)
  }

  static async updateCategoryInfo(catInfo) {
    const {id, name} = catInfo
    return Admin.updateCategory(id, name)
  }

  static async updatePublisherInfo(publisherInfo) {
    const {id, name} = publisherInfo
    return Admin.updatePublisher(id, name)
  }

  static async deleteBookInfo(idBook) {
    return Admin.deleteBook(idBook)
  }
}

module.exports = { AdminServices };