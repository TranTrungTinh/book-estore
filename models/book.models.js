const { queryDB } = require('../helpers/connectDatabase');

class Book {
  static getAll(nameTable) {
    const slq = `SELECT * FROM ${nameTable}`;
    return queryDB(slq);
  }
  
}

module.exports = {Book};