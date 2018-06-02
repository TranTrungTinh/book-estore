const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { AdminServices } = require('../services/admin.services');
const { mustBeAdmin, checkTokenAdmin } = require('../middleware/mustBeAdmin.middleware');

const adminRouter = Router();
adminRouter.use(parser.urlencoded({extended: false}));
adminRouter.use(parser.json());
adminRouter.use(cookieParser());

adminRouter.get('/edit', mustBeAdmin, (req, res) => {
  res.render('render/admin', { isLogin: true });
});

adminRouter.get('/login', checkTokenAdmin, (req, res) => {
  res.render('render/admin', { isLogin: false });
});

adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  AdminServices.signInWith(username, password)
  .then(admin => {
    res.cookie('ADMIN', admin.TOKEN);
    res.send({ success: true, message: 'OK'});
  })
  .catch(error => res.send({ success: false }));
});

module.exports = { adminRouter }