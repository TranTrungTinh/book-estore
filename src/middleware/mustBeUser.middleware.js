const { verify, sign } = require('../helpers/jwt');


function mustBeUser(req, res, next) {
  const { TOKEN } = req.cookies;
  if(!TOKEN) return res.redirect('/home');
  verify(TOKEN)
  .then(obj => {
    req.idUser = obj.ID;
    return sign(obj);
  })
  .then(newToken => {
    res.cookie('TOKEN', newToken);
    next();
  })
  .catch(error => res.send({ success: false, message: 'INVALID_TOKEN' }));
}

module.exports = { mustBeUser };