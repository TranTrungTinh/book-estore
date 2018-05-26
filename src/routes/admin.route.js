const { Router } = require('express');

const adminRouter = Router();

adminRouter.get('/edit', (req, res) => {
  res.render('render/admin', { isLogin: true });
});

adminRouter.get('/login', (req, res) => {
  res.render('render/admin', { isLogin: false });
});

module.exports = { adminRouter }