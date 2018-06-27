const { queryDB } = require('../helpers/connectDatabase');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../helpers/jwt');
const { Cart } = require('./cart.models');
const saltRound = 8;

class User {
  static async save(email, rawPassword, name, gender){
    const selectSql = `SELECT ID FROM NGUOIDUNG WHERE EMAIL = '${email}' AND PERMISSION <> 1`;
    const result = await queryDB(selectSql);
    if(result[0]) throw new Error('EMAIL_EXISTED');

    const insertSql = `INSERT INTO NGUOIDUNG(ID, EMAIL, PASSWORD, NAME, GENDER) 
                        VALUES (?, ?, ?, ?, ?);`;
    const id = Math.round(Math.random() * 10000) + '';
    const password = await hash(rawPassword , saltRound);
    return queryDB(insertSql ,[id, email, password, name, gender] );
  }

  static async getUserBy(email, rawPassword) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE EMAIL = '${email}' AND PERMISSION <> 1`; 
    const user = await queryDB(sql);
    if(!user[0]) throw new Error('INVALID_USER_INFO');
    const same = await compare(rawPassword, user[0].PASSWORD);
    if (!same) throw new Error('INVALID_USER_INFO');
    const userInfo = { NAME: user[0].NAME };
    const TOKEN = await sign({ ID: user[0].ID });
    const count = await Cart.getCountOfCarts(user[0].ID);
    return { NAME: user[0].NAME, TOKEN, COUNT: count[0].COUNT };
  }

  static async getUserById(id) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE ID = '${id}' AND PERMISSION <> 1`;
    const user = await queryDB(sql);
    if(!user[0]) throw new Error('CANNOT_FIND_USER');
    return user[0];
  }

  static async update(idUser, name, phone, birthday, gender) {
    const sql = `UPDATE NGUOIDUNG 
    SET NAME = ?, PHONE = ?, BIRTHDAY = ?, GENDER = ? WHERE ID = ?`;
    await queryDB(sql, [name, phone, birthday, gender, idUser]);
    return name;
  }

  static async updateAddress(idUser, address) {
    const sql = `UPDATE NGUOIDUNG SET ADDRESS = ? WHERE ID = ?`;
    await queryDB(sql, [address, idUser]);
    return address;
  }

}

// User.save('admin','admin','TRƯƠNG HOÀNG DUY','NAM')
// .then(result => console.log(result))
// .catch(err => console.log(err.message));

module.exports = { User };