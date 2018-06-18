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

    const bookCount = books.length,
          pageCount = Math.round(bookCount / ITEMS_PER_PAGE)

    return { books, bookCount, pageCount }
  }

  static async showOrders() {
    const orders = await Admin.getAllOrders()
    if(!orders) throw new Error('Khong tim thay')

    const orderCount = orders.length,
          pageCount = Math.round(orderCount / ITEMS_PER_PAGE)

    return { orders, orderCount, pageCount }
  }

  static async showAuthors() {
    const authors = await Admin.getAllAuthors()
    if(!authors) throw new Error('Khong tim thay')

    const authorCount = authors.length,
          pageCount = Math.round(authorCount / ITEMS_PER_PAGE)

    return { authors, authorCount, pageCount }
  }

  static async showCategories() {
    const cats = await Admin.getAllCategories()
    if(!cats) throw new Error('Khong tim thay')

    const catCount = cats.length,
          pageCount = Math.round(catCount / ITEMS_PER_PAGE)

    return { cats, catCount, pageCount }
  }

  static async showPublishers() {
    const publishers = await Admin.getAllPublishers()
    if(!publishers) throw new Error('Khong tim thay')

    const publisherCount = publishers.length,
          pageCount = Math.round(publisherCount / ITEMS_PER_PAGE)

    return { publishers, publisherCount, pageCount }
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