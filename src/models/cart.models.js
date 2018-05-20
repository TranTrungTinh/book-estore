const { queryDB } = require('../helpers/connectDatabase');

class Cart {
  static async save(idUser, idBook) {
    const selectSql = `SELECT * FROM GIOHANG WHERE ID_BOOK = ${idBook}`;
    const result = await queryDB(selectSql);
    if(result[0]) throw new Error('BOOK_EXISTED');

    const sql = `INSERT INTO GIOHANG(ID_USER, ID_BOOK) VALUES (?, ?);`;
    return queryDB(sql, [idUser, idBook]);
  }
}

module.exports = { Cart };