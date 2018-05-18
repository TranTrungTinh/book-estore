const { verify, sign } = require('../helpers/jwt');


function mustBeUser(req, res, next) {
  const { TOKEN } = req.cookies;
  if(!TOKEN) return next();
  verify(TOKEN)
  .then(obj => sign(obj))
  .then(newToken => {
    res.cookie('TOKEN', newToken);
    res.redirect('/user/account/edit');
  })
  .catch(error => res.send({ success: false, message: 'INVALID_TOKEN' }));
}

module.exports = { mustBeUser };