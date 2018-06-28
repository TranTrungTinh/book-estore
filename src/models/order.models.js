const { queryDB } = require('../helpers/connectDatabase');
const { Cart } = require('./cart.models');
const { Book } = require('./book.models');
const { getCurrentDate } = require('../helpers/getCurrentDate');

class Order {

  static saveOrderDetail(idOrder, idBook, amount) {
    const sql = `INSERT INTO CHITIETDONHANG(ID_ORDER, ID_BOOK, AMOUNT)
                 VALUES (?, ?, ?)`;
    return queryDB(sql, [idOrder, idBook, amount]);
  }

  static async saveOrder(idUser, total) {
    const results = await Cart.getCartByIdAndDelete(idUser);
    if(!results[0].length) throw new Error('CANNOT_FIND_ITEM');

    const carts = results[0];
    const idOrder = Math.round(Math.random() * 1000000) + '';
    const currentDate = getCurrentDate();

    const length = carts.length;
    let content = carts[0].NAME;
    if(length > 1) content += `... và ${length - 1} sản phẩm khác.`;
    for (let index = 0; index < carts.length; index++) {
      const { ID_BOOK, AMOUNT} = carts[index];
      await this.saveOrderDetail(idOrder, ID_BOOK, AMOUNT);
      await Book.updateSales(ID_BOOK, AMOUNT);
    }
    
    const sql = `INSERT INTO DONHANG(ID, ID_USER, DATE_CREATED, CONTENT, TOTAL_COST)
                 VALUES (?, ?, ?, ?, ?)`;
    
    return queryDB(sql, [idOrder, idUser, currentDate, content, total]);
  }

  static getAllOrderByIdUser(idUser) {
    const sql = `SELECT *, DATE_FORMAT(DATE_CREATED,'%d/%m/%Y') AS DATE_CREATED 
                 FROM DONHANG WHERE ID_USER = ${idUser} ORDER BY DATE_FORMAT(DATE_CREATED,'%Y/%m/%d') DESC`;
    return queryDB(sql);
  }

  static getDetailOrderByIdOrder(idOrder) {
    const sql = `SELECT d.ID, d.STATE, DATE_FORMAT(d.DATE_CREATED,'%d/%m/%Y') AS DATE_CREATED, d.TOTAL_COST, t.NAME, t.IMAGE, t.PRICE, c.AMOUNT 
                 FROM DONHANG d, CHITIETDONHANG c, THONGTINSACH t
                 WHERE d.ID = ${idOrder}
                 AND c.ID_ORDER = d.ID
                 AND c.ID_BOOK = t.ID`;
    return queryDB(sql);
  }

}

module.exports = { Order }

