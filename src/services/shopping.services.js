const { Cart } = require('../models/cart.models');

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
}

module.exports = { shoppingServices };