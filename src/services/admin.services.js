const { Admin } = require('../models/admin.models');

class AdminServices {

  static signInWith(email, password) {
    return Admin.signIn(email, password);
  }

}

module.exports = { AdminServices };