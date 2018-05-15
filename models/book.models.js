const { queryDB } = require('../helpers/connectDatabase');

class Book {
  static getAll(nameTable) {
    const slq = `SELECT * FROM ${nameTable} LIMIT 10`;
    return queryDB(slq);
  }

  static getTopNew() {
    const slq = `SELECT * FROM THONGTINSACH ORDER BY VIEWS LIMIT 10`;
    return queryDB(slq);
  }

  static getTopSale() {
    const slq = `SELECT * FROM THONGTINSACH ORDER BY SALES DESC LIMIT 10`;
    return queryDB(slq);
  }

  static getTopView() {
    const slq = `SELECT * FROM THONGTINSACH ORDER BY VIEWS DESC LIMIT 10`;
    return queryDB(slq);
  }
  
}

module.exports = {Book};