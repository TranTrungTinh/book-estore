const { queryDB } = require('../helpers/connectDatabase');
const rowOfPage = 8;

class Book {
  static getAllCategoryAuthorPublisher() {
    const slq = `SELECT * FROM DANHMUCSACH LIMIT 10;
                 SELECT * FROM NHAXUATBAN LIMIT 10;
                 SELECT * FROM TACGIA LIMIT 10;`;
    return queryDB(slq);
  }
  static getTopNewSaleView() {
    const slq = `SELECT * FROM THONGTINSACH ORDER BY VIEWS LIMIT 10;
                 SELECT * FROM THONGTINSACH ORDER BY SALES DESC LIMIT 10;
                 SELECT * FROM THONGTINSACH ORDER BY VIEWS DESC LIMIT 10;`;
    return queryDB(slq);
  }

  static getBookWithIDCategory(currentPage, idCategory) {
    const start = (+currentPage - 1) * rowOfPage || 0;

    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_CATEGORY = ${idCategory};
                 SELECT ID, NAME, IMAGE, PRICE, SALES
                 FROM THONGTINSACH WHERE ID_CATEGORY = ${idCategory} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookWithIDAuthor(currentPage, idAuthor) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_AUTHOR = ${idAuthor};
                 SELECT ID, NAME, IMAGE, PRICE, SALES
                 FROM THONGTINSACH WHERE ID_AUTHOR = ${idAuthor} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookWithIDPublisher(currentPage, idPublisher) {
    const start = (+currentPage - 1) * rowOfPage || 0;
    const sql = `SELECT COUNT(ID) as count
                 FROM THONGTINSACH WHERE ID_PUBLISHER = ${idPublisher};
                 SELECT ID, NAME, IMAGE, PRICE, SALES
                 FROM THONGTINSACH WHERE ID_PUBLISHER = ${idPublisher} LIMIT ${start}, ${rowOfPage}`;
    return queryDB(sql);
  }

  static getBookInfo(idBook) {
    const sql = `SELECT * FROM THONGTINSACH WHERE ID = ${idBook};

                 SELECT dm.* FROM THONGTINSACH b, DANHMUCSACH dm 
                 WHERE b.ID = ${idBook} AND dm.ID = b.ID_CATEGORY;

                 SELECT nxb.* FROM THONGTINSACH b, NHAXUATBAN nxb 
                 WHERE b.ID = ${idBook} AND nxb.ID = b.ID_PUBLISHER;

                 SELECT tg.* FROM THONGTINSACH b, TACGIA tg 
                 WHERE b.ID = ${idBook} AND tg.ID = b.ID_AUTHOR;`;
    return queryDB(sql);
  }
  
}

module.exports = {Book};