const { queryDB } = require('../helpers/connectDatabase');
const { compare, hash } = require('bcrypt');
const { sign } = require('../helpers/jwt');
const { checkExistsAndDelete } = require('../helpers/checkExistsAndDelete');

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
    const sql = `SELECT *, DATE_FORMAT(DATE_CREATED,'%d/%m/%Y') AS DATE_CREATED FROM DONHANG ORDER BY DATE_FORMAT(DATE_CREATED,'%Y/%m/%d %H:%i') DESC`;
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

  static async saveNewBook(newId, name, image, price, amount, description, author, type, publisher, date) {
    const sql = `INSERT INTO THONGTINSACH(ID, NAME, IMAGE, PRICE, INVENTORY, DESCRIPTION, ID_AUTHOR, ID_CATEGORY, ID_PUBLISHER, DATE_CREATED)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return queryDB(sql, [ newId, name, image, price, amount, description, author, type, publisher, date]);
  }

  static async saveNewAuthor(authorName) {
    let newId = Math.round(Math.random() * 1000) + '';
    if(+newId < 10) newId = '00' + newId;
    else if(+newId < 100) newId = '0' + newId;

    const sql = `INSERT INTO TACGIA(ID, NAME) VALUES (?, ?)`;
    await queryDB(sql, [ newId, authorName ]);

    return newId;
  }

  static async saveNewCategory(catName) {
    let newId = Math.round(Math.random() * 100) + '';
    if(+newId < 10) newId = '00' + newId;
    
    const sql = `INSERT INTO DANHMUCSACH(ID, NAME) VALUES (?, ?)`;
    await queryDB(sql, [ newId, catName ]);

    return newId;
  }

  static async saveNewPublisher(publisherName) {
    let newId = Math.round(Math.random() * 1000) + '';
    if(+newId < 10) newId = '00' + newId;
    else if(+newId < 100) newId = '0' + newId;

    const sql = `INSERT INTO NHAXUATBAN(ID, NAME) VALUES (?, ?)`;
    await queryDB(sql, [ newId, publisherName ]);

    return newId;
  }

  static updateBook(idBook, name, image, price, amount, description, author, type, publisher) {
    const sql = `UPDATE THONGTINSACH
                SET NAME = ?, IMAGE = ?, PRICE = ?, INVENTORY = ?, DESCRIPTION = ?, ID_CATEGORY = ?, ID_AUTHOR = ?, ID_PUBLISHER = ?
                WHERE ID = ?`;
    return queryDB(sql, [ name, image, price, amount, description, type, author, publisher, idBook ]);
  }

  static async updateOrder(orderId, orderStt) {
    const checkExistSql = `SELECT ID FROM DONHANG WHERE ID = ?`
    const exists = await queryDB(checkExistSql, [ orderId ])
    
    let orderState = -1
    switch(orderStt) {
      case 'delivering':
      orderState = 2
      break
      case 'done':
      orderState = 3
      break
      case 'pending':
      default:
      orderState = 1
      break
    }
    
    if(exists) {
      const sql = `UPDATE DONHANG
                SET STATE = ?
                WHERE ID = ?`
      await queryDB(sql, [ orderState, orderId ]);
    }

    return exists
  }

  static async updateAuthor(authorId, authorName) {
    const checkExistSql = `SELECT ID FROM TACGIA WHERE ID = ?`
    const exists = await queryDB(checkExistSql, [ authorId ])

    if(exists) {
      const sql = `UPDATE TACGIA
                SET NAME = ?
                WHERE ID = ?`
      await queryDB(sql, [ authorName, authorId ]);
    }

    return exists
  }

  static async updateCategory(catId, catName) {
    const checkExistSql = `SELECT ID FROM DANHMUCSACH WHERE ID = ?`
    const exists = await queryDB(checkExistSql, [ catId ])

    if(exists) {
      const sql = `UPDATE DANHMUCSACH
                  SET NAME = ?
                  WHERE ID = ?`;
      await queryDB(sql, [ catName, catId ]);
    }

    return exists
  }
  
  static async updatePublisher(publisherId, publisherName) {
    const checkExistSql = `SELECT ID FROM NHAXUATBAN WHERE ID = ?`
    const exists = await queryDB(checkExistSql, [ publisherId ])

    if(exists) {
      const sql = `UPDATE NHAXUATBAN
                  SET NAME = ?
                  WHERE ID = ?`;
      await queryDB(sql, [ publisherName, publisherId ]);
    }

    return exists
  }

  static async deleteBook(bookId) {
    const checkExistSql = `SELECT IMAGE FROM THONGTINSACH WHERE ID = ?`
    const image = await queryDB(checkExistSql, [ bookId ]);
    if(!image) throw new Error('CANNOT_FIND_BOOK');
    const sql = `DELETE FROM THONGTINSACH WHERE ID = ?`;
    await checkExistsAndDelete(image[0].IMAGE);
    return queryDB(sql, [ bookId ]);
    
  }
}

module.exports = { Admin };