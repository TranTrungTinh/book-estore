const { queryDB } = require('../helpers/connectDatabase');
const { hash, compare } = require('bcrypt');
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

  // static async signIn(email , rawPassword){        
         
  // }

}

// User.save('trantrungtinh4955@gmail.com','123','Tran Trung Tinh', 'Nam')
// .then(result => console.log(result))
// .catch(err => console.log(err.message));

module.exports = { User };