const { queryDB } = require('../helpers/connectDatabase');

class Cart {
  static async save(idUser, idBook, amount) {
    const selectSql = `SELECT * FROM GIOHANG WHERE ID_BOOK = ? AND ID_USER = ?`;
    const result = await queryDB(selectSql, [idBook, idUser]);
    if(result[0]) throw new Error('BOOK_EXISTED');

    const sql = `INSERT INTO GIOHANG(ID_USER, ID_BOOK, AMOUNT) VALUES (?, ?, ?);
                 SELECT COUNT(*) as COUNT FROM GIOHANG WHERE ID_USER = ${idUser};`;
    return queryDB(sql, [idUser, idBook, amount]);
  }

  static getCarts(idUser) {
    const sql = `SELECT s.ID, s.NAME, s.PRICE, s.SALES, s.IMAGE, g.AMOUNT
                 FROM GIOHANG g, THONGTINSACH s
                 WHERE g.ID_USER = ${idUser}
                 AND g.ID_BOOK = s.ID`;
    return queryDB(sql);
  }

  static getCountOfCarts(idUser) {
    const sql = `SELECT COUNT(*) as COUNT FROM GIOHANG WHERE ID_USER = ${idUser}`;
    return queryDB(sql);
  }

  static updateCart(idUser, idBook, amount) {
    const sql = `UPDATE GIOHANG SET AMOUNT = ? WHERE ID_USER = ? AND ID_BOOK = ?;
                 SELECT COUNT(*) as COUNT FROM GIOHANG WHERE ID_USER = ${idUser};`;
    return queryDB(sql, [amount, idUser, idBook]);
  }

  static deleteCart(idUser, idBook) {
    const sql = `DELETE FROM GIOHANG WHERE ID_USER = ? AND ID_BOOK = ?;
                 SELECT COUNT(*) as COUNT FROM GIOHANG WHERE ID_USER = ${idUser};`;
    return queryDB(sql, [idUser, idBook]);
  }

  static getCartByIdAndDelete(idUser) {
    const sql = `SELECT g.ID_BOOK, g.AMOUNT, s.NAME, s.PRICE
                 FROM GIOHANG g, THONGTINSACH s
                 WHERE g.ID_USER = ${idUser}
                 AND g.ID_BOOK = s.ID;

                 DELETE FROM GIOHANG WHERE ID_USER = ${idUser};`;
    return queryDB(sql);
  }

  static isExistedItem(idUser, idBook) {
    const sql = `SELECT ID FROM GIOHANG WHERE ID_USER = ? AND ID_BOOK = ?`;
    return queryDB(sql, [idUser, idBook]);
  }
}

module.exports = { Cart };