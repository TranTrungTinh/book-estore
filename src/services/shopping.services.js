const { Cart } = require('../models/cart.models');

class shoppingServices {
  static saveItem(idUser, idBook) {
    return Cart.save(idUser, idBook);
  }
}

module.exports = { shoppingServices };