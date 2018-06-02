const { verify, sign } = require('../helpers/jwt');


function mustBeAdmin(req, res, next) {
  const { ADMIN } = req.cookies;
  if(!ADMIN) return res.redirect('/admin/login');
  verify(ADMIN)
  .then(obj => sign(obj))
  .then(newToken => {
    res.cookie('ADMIN', newToken);
    next();
  })
  .catch(error => res.send({ success: false, message: 'INVALID_TOKEN' }));
}

function checkTokenAdmin(req, res, next) {
  const { ADMIN } = req.cookies;
  if(!ADMIN) return next();
  res.redirect('/admin/edit');
}

module.exports = { mustBeAdmin, checkTokenAdmin };