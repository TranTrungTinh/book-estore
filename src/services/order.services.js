const { Order } = require('../models/order.models');

class OrderServices {

  static saveOrderByIdUser(idUser, total) {
    return Order.saveOrder(idUser, total);
  }

  static async showHistoryOrderByIdUser(idUser) {
    const results = await Order.getAllOrderByIdUser(idUser);
    if(!results[0]) throw new Error("CANNOT_FIND_ORDER");
    return results;
  }

  static async showOrderDetailByIdOrder(idOrder) {
    const results = await Order.getDetailOrderByIdOrder(idOrder);
    if(!results[0]) throw new Error("CANNOT_FIND_ORDER");
    return results;
  }

}

module.exports = { OrderServices }