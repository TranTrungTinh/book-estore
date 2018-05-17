const { User } = require('../models/user.models');

class UserServices {
  static async signUp(userInfo) {
    const { email, password, name, gender } = userInfo;
    await User.save(email, password, name, gender);
    return {email , name};
  }
}

module.exports = { UserServices };