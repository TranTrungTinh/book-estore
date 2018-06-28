const { Cart } = require('../models/cart.models');
const { Book } = require('../models/book.models');

class shoppingServices {
  static async saveItem(idUser, idBook, amount) {
    const results = await Cart.save(idUser, idBook, amount);
    return results[1][0].COUNT;
  }

  static async getItem(idUser) {
    const results = await Cart.getCarts(idUser);
    if(!results[0]) throw new Error('CANNOT_FIND_CART');
    return results;
  }

  static async updateItem(idUser, idBook, amount) {
    const results = await Cart.updateCart(idUser, idBook, amount);
    return results[1][0].COUNT;
  }

  static async deleteItem(idUser, idBook) {
    const results = await Cart.deleteCart(idUser, idBook);
    return results[1][0].COUNT;
  }

  static async isEnoughAmount(idBook) {
    const results = await Book.getInventoryById(idBook);
    return results[0].INVENTORY;
  }

  static async isExitedBookInCart(idUser, idBook) {
    const results = await Cart.isExistedItem(idUser, idBook);
    if(!results[0]) return false;
    return true; 
  }
}

module.exports = { shoppingServices };