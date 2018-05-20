const { Cart } = require('../models/cart.models');

class shoppingServices {
  static async saveItem(idUser, idBook) {
    const results = await Cart.save(idUser, idBook);
    return results[1][0].COUNT;
  }

  static async getItem(idUser) {
    const results = await Cart.getCarts(idUser);
    if(!results[0]) throw new Error('CANNOT_FIND_CART');
    return results;
  }
}

module.exports = { shoppingServices };