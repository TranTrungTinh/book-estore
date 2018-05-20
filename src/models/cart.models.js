const { queryDB } = require('../helpers/connectDatabase');

class Cart {
  static async save(idUser, idBook) {
    const selectSql = `SELECT * FROM GIOHANG WHERE ID_BOOK = ${idBook}`;
    const result = await queryDB(selectSql);
    if(result[0]) throw new Error('BOOK_EXISTED');

    const sql = `INSERT INTO GIOHANG(ID_USER, ID_BOOK) VALUES (?, ?);
                 SELECT COUNT(*) as COUNT FROM GIOHANG;`;
    return queryDB(sql, [idUser, idBook]);
  }

  static getCarts(idUser) {
    const sql = `SELECT s.ID, s.NAME, s.PRICE, s.SALES, s.IMAGE, g.AMOUNT
                 FROM GIOHANG g, THONGTINSACH s
                 WHERE g.ID_USER = ${idUser}
                 AND g.ID_BOOK = s.ID`;
    return queryDB(sql);
  }
}

module.exports = { Cart };