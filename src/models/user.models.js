const { queryDB } = require('../helpers/connectDatabase');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../helpers/jwt');
const saltRound = 8;

class User {
  static async save(email, rawPassword, name, gender){
    const selectSql = `SELECT ID FROM NGUOIDUNG WHERE EMAIL = '${email}'`;
    const result = await queryDB(selectSql);
    if(result[0]) throw new Error('EMAIL_EXISTED');

    const insertSql = `INSERT INTO NGUOIDUNG(ID, EMAIL, PASSWORD, NAME, GENDER) 
                        VALUES (?, ?, ?, ?, ?);`;
    const id = Math.round(Math.random() * 10000) + '';
    const password = await hash(rawPassword , saltRound);
    return queryDB(insertSql ,[id, email, password, name, gender] );
  }

  static async getUserBy(email, rawPassword) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE EMAIL = '${email}'`; 
    const user = await queryDB(sql);
    if(!user[0]) throw new Error('INVALID_USER_INFO');
    const same = await compare(rawPassword, user[0].PASSWORD);
    if (!same) throw new Error('INVALID_USER_INFO');
    const {NAME, EMAIL, GENDER, BIRTHDAY} = user[0];
    const userInfo = {NAME, EMAIL, GENDER, BIRTHDAY};
    userInfo.TOKEN = await sign({ ID: user[0].ID });
    return userInfo;
  }

  static async getUserById(id) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE ID = '${id}'`;
    const user = await queryDB(sql);
    if(!user[0]) throw new Error('CANNOT_FIND_USER');
    return user[0];
  }
}

// User.getUserBy('trantrungtinh@gmail.com','123')
// .then(result => console.log(result))
// .catch(err => console.log(err.message));

module.exports = { User };