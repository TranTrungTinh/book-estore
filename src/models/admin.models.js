const { queryDB } = require('../helpers/connectDatabase');
const { compare, hash } = require('bcrypt');
const { sign } = require('../helpers/jwt');

class Admin {
  
  static async signIn(email, rawPassword) {
    const sql = `SELECT * FROM NGUOIDUNG WHERE EMAIL = '${email}' AND PERMISSION = 1 `; 
    const user = await queryDB(sql);
    if(!user[0]) throw new Error('INVALID_USER_INFO');
    const same = await compare(rawPassword, user[0].PASSWORD);
    if (!same) throw new Error('INVALID_USER_INFO');
    const userInfo = { NAME: user[0].NAME };
    userInfo.TOKEN = await sign({ ID: user[0].ID });
    return userInfo;
  }

}

module.exports = { Admin };