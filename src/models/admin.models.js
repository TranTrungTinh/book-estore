const { queryDB } = require('../helpers/connectDatabase');
const { compare, hash } = require('bcrypt');
const { sign } = require('../helpers/jwt');

class Admin {

  static async signIn(email, rawPassword) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE EMAIL = '${email}' AND PERMISSION = 1 `;
    const user = await queryDB(sql);
    if (!user[0]) throw new Error('INVALID_USER_INFO');
    const same = await compare(rawPassword, user[0].PASSWORD);
    if (!same) throw new Error('INVALID_USER_INFO');
    const userInfo = {
      NAME: user[0].NAME
    };
    userInfo.TOKEN = await sign({
      ID: user[0].ID
    });
    return userInfo;
  }

  static getAllBooks() {
    const sql = `SELECT s.ID as ID, s.NAME as NAME, s.IMAGE as IMAGE, s.PRICE as PRICE, s.INVENTORY as INVENTORY, s.DESCRIPTION as DESCRIPTION, s.ID_AUTHOR as AUTHOR_ID, tg.NAME as AUTHOR_NAME, s.ID_CATEGORY as CATEGORY_ID, dm.NAME as CATEGORY_NAME, s.ID_PUBLISHER as PUBLISHER_ID, nxb.NAME as PUBLISHER_NAME
                FROM THONGTINSACH s, TACGIA tg, DANHMUCSACH dm, NHAXUATBAN nxb
                WHERE s.ID_AUTHOR = tg.ID
                AND s.ID_CATEGORY = dm.ID
                AND s.ID_PUBLISHER = nxb.ID
                ORDER BY s.ID`;
    return queryDB(sql);
  }

  static getAllOrders() {
    const sql = `SELECT * FROM DONHANG ORDER BY DATE_CREATED`;
    return queryDB(sql);
  }

  static getAllAuthors() {
    const sql = `SELECT * FROM TACGIA ORDER BY ID`;
    return queryDB(sql);
  }

  static getAllCategories() {
    const sql = `SELECT * FROM DANHMUCSACH ORDER BY ID`;
    return queryDB(sql);
  }

  static getAllPublishers() {
    const sql = `SELECT * FROM NHAXUATBAN ORDER BY ID`;
    return queryDB(sql);
  }

  static saveMewBook(name, image, price, inventory, description, authorId, catId, publisherId) {
    const newId = Math.round(Math.random() * 10000) + '';
    const sql = `INSERT INTO THONGTINSACH(ID, NAME, IMAGE, PRICE, INTENTORY, DESCRIPTION, ID_AUTHOR, ID_CATEGORY, ID_PUBLISHER)
    VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return queryDB(sql, [ newId, name, image, price, inventory, description, authorId, catId, publisherId ]);
  }

  static saveNewCategory(catName) {
    const newId = Math.round(Math.random() * 1000) + ''
    const sql = `INSERT INTO DANHMUCSACH(ID, NAME) VALUES (?, ?)`;
    return queryDB(sql, [ catName ]);
  }

  static saveNewAuthor(authorName) {
    const newId = Math.round(Math.random() * 1000) + '';
    const sql = `INSERT INTO TACGIA(ID, NAME) VALUES (?, ?)`;
    return queryDB(sql, [ authorName ]);
  }

  static saveNewPublisher(publisherName) {
    const newId = Math.round(Math.random() * 1000) + '';
    const sql = `INSERT INTO NHAXUATBAN(ID, NAME) VALUES (?, ?)`;
    return queryDB(sql, [ publisherName ]);
  }

  static updateBook(idBook, name, image, price, inventory, description, idAuthor, idCat, idPublisher) {
    const sql = `UPDATE THONGTINSACH
                SET NAME = ?, IMAGE = ?, PRICE = ?, INVENTORY = ?, DESCRIPTION = ?, ID_CATEGORY = ?, ID_AUTHOR = ?, ID_PUBLISHER = ?
                WHERE ID = ?`;
    return queryDB(sql, [ name, image, price, inventory, description, idCat, idAuthor, idPublisher, idBook ]);
  }

  static updateCategory(catId, catName) {
    const sql = `UPDATE DANHMUCSACH
                SET NAME = ?
                WHERE ID = ?`;
    return queryDB(sql, [ catName, catId ]);
  }

  static updateAuthor(authorId, authorName) {
    const sql = `UPDATE TACGIA
                SET NAME = ?
                WHERE ID = ?`
    return queryDB(sql, [ authorName, authorId ]);
  }
  
  static updatePublisher(publisherId, publisherName) {
    const sql = `UPDATE NHAXUATBAN
                SET NAME = ?
                WHERE ID = ?`;
    return queryDB(sql, [ publisherName, publisherId ]);
  }

  static deleteBook(bookId) {
    const sql = `DELETE FROM THONGTINSACH
                WHERE ID = ?`;
    return queryDB(sql, [ bookId ]);
  }

}

module.exports = { Admin };