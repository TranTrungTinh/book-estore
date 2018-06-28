const { queryDB } = require('../helpers/connectDatabase');
const rowOfPage = 8;

class Book {
  static getAllCategoryAuthorPublisher() {
    const slq = `SELECT dm.*, COUNT(b.ID) as COUNT
                 FROM THONGTINSACH b, DANHMUCSACH dm
                 WHERE b.ID_CATEGORY = dm.ID
                 GROUP BY dm.NAME
                 ORDER BY COUNT DESC
                 LIMIT 10;
                 
                 SELECT tg.*, COUNT(b.ID) as COUNT
                 FROM THONGTINSACH b, TACGIA tg
                 WHERE b.ID_AUTHOR = tg.ID
                 GROUP BY tg.NAME
                 ORDER BY COUNT DESC
                 LIMIT 10;
                 
                 SELECT nxb.*, COUNT(b.ID) as COUNT
                 FROM THONGTINSACH b, NHAXUATBAN nxb
                 WHERE b.ID_PUBLISHER = nxb.ID
                 GROUP BY nxb.NAME
                 ORDER BY COUNT DESC
                 LIMIT 10;`;
    return queryDB(slq);
  }

  static getTopNewSaleView() {
    const subSql = 'SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY FROM THONGTINSACH ORDER BY';
    const slq = `${subSql} DATE_FORMAT(DATE_CREATED,'%Y/%m/%d %H:%i') DESC LIMIT 10;
                 ${subSql} SALES DESC LIMIT 10;
                 ${subSql} VIEWS DESC LIMIT 10;`;
    return queryDB(slq);
  }

  static getBookWithIDCategory(currentPage, idCategory) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_CATEGORY = ${idCategory};
                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH WHERE ID_CATEGORY = ${idCategory} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookWithIDAuthor(currentPage, idAuthor) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_AUTHOR = ${idAuthor};
                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH WHERE ID_AUTHOR = ${idAuthor} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookWithIDPublisher(currentPage, idPublisher) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_PUBLISHER = ${idPublisher};
                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH WHERE ID_PUBLISHER = ${idPublisher} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookInfo(idBook) {
    const sql = `SELECT b.*, dm.NAME as C_NAME, nxb.NAME as P_NAME, tg.NAME as A_NAME
                 FROM THONGTINSACH b, DANHMUCSACH dm, NHAXUATBAN nxb, TACGIA tg
                 WHERE b.ID = ${idBook}
                 AND dm.ID = b.ID_CATEGORY
                 AND nxb.ID = b.ID_PUBLISHER
                 AND tg.ID = b.ID_AUTHOR;
                 
                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH
                 WHERE ID <> ${idBook}
                 AND ID_CATEGORY = ( SELECT ID_CATEGORY FROM THONGTINSACH WHERE ID = ${idBook} )
                 LIMIT 5;
                 
                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH
                 WHERE ID <> ${idBook}
                 AND ID_PUBLISHER = ( SELECT ID_PUBLISHER FROM THONGTINSACH WHERE ID = ${idBook} )
                 LIMIT 5;`;
    return queryDB(sql);
  }

  static getBookWithPrice(currentPage, priceStart, priceEnd) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH 
                 WHERE PRICE BETWEEN ${priceStart} AND ${priceEnd};

                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH
                 WHERE PRICE BETWEEN ${priceStart} AND ${priceEnd}
                 LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookWithName(currentPage, nameSearch) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH 
                 WHERE NAME LIKE '%${nameSearch}%';

                 SELECT ID, NAME, IMAGE, PRICE, VIEWS, SALES, INVENTORY
                 FROM THONGTINSACH
                 WHERE NAME LIKE '%${nameSearch}%'
                 LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static updateViews(idBook) {
    const sql = `UPDATE THONGTINSACH SET VIEWS = VIEWS + 1 WHERE ID = ${idBook}`;
    return queryDB(sql);
  }

  static updateSales(idBook, amount) {
    const sql = `UPDATE THONGTINSACH SET SALES = SALES + ?, INVENTORY = INVENTORY - ? WHERE ID = ?`;
    return queryDB(sql, [amount, amount, idBook]);
  }

  static getInventoryById(idBook) {
    const sql = `SELECT INVENTORY FROM THONGTINSACH WHERE ID = ?`;
    return queryDB(sql, [idBook]);
  }

}

module.exports = {Book};