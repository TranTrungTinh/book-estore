const { User } = require('../models/user.models');

class UserServices {
  static async signUp(userInfo) {
    const { email, password, name, gender } = userInfo;
    await User.save(email, password, name, gender);
    return {email , name};
  }

  static signIn(email, password) {
    return User.getUserBy(email, password);
  }

  static showUserInfoBy(idUser) {
    return User.getUserById(idUser);
  }

  static updateUserInfo(userInfo) {
    const {id, name, phone, birthday, gender} = userInfo;
    return User.update(id, name, phone, birthday, gender);
  }
  static updateUserAddress(userInfo) {
    const {id, address} = userInfo;
    return User.updateAddress(id, address);
  }
}

module.exports = { UserServices };