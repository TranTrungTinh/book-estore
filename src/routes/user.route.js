const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { UserServices } = require('../services/user.services');
const { OrderServices } = require('../services/order.services');
const { mustBeUser } = require('../middleware/mustBeUser.middleware');
const { mustCheckCaptcha } = require('../middleware/mustCheckCaptcha.middleware');
const { showStatus } = require('../helpers/getCurrentDate');
const { priceFormat } = require('../helpers/priceFormat');

const userRouter = Router();

userRouter.use(parser.urlencoded({extended: false}));
userRouter.use(parser.json());
userRouter.use(cookieParser());

userRouter.post('/signup', mustCheckCaptcha, (req, res) => {
  UserServices.signUp(req.body)
  .then(user => res.send({ success: true, user }))
  .catch(error => res.send({ success: false, message: error.message }));
});

userRouter.post('/signin', (req, res) => {
  const { email, password } = req.body;
  UserServices.signIn(email, password)
  .then(user => {
    res.cookie('TOKEN', user.TOKEN);
    res.send({ success: true, user });
  })
  .catch(error => res.send({ success: false, message: error.message }));
});

userRouter.post('/logout', (req, res) => {
  const {TOKEN} = req.cookies;
  if(!TOKEN) return res.send({ success: false });
  res.clearCookie('TOKEN');
  res.send({ success: true });
});

userRouter.get('/account/edit', mustBeUser, (req, res) => {
  UserServices.showUserInfoBy(req.idUser)
  .then(user => res.render('render/account', { isDetail: 1, user}))
  .catch(error => res.render('render/account', { isDetail: 1 }));
});

userRouter.post('/account/update', mustBeUser, (req, res) => {
  const { name, gender, birthday, phone } = req.body;
  const userInfo = {id: req.idUser, name, phone, gender, birthday};
  UserServices.updateUserInfo(userInfo)
  .then(name => res.send({ success: true, name}))
  .catch(error => res.send({ success: false, message: error.message }));
});

userRouter.get('/account/orders', mustBeUser, (req, res) => {
  OrderServices.showHistoryOrderByIdUser(req.idUser)
  .then(orders => res.render('render/account', { isDetail: 2, orders, showStatus }))
  .catch(error => res.render('render/account', { isDetail: 2, orders: [], showStatus}));
});

userRouter.get('/account/order/history/:id', (req, res) => {
  OrderServices.showOrderDetailByIdOrder(req.params.id)
  .then(orders => res.render('render/historyOrder', {  orders, showStatus, priceFormat }))
  .catch(error => res.redirect('/error'));
});

userRouter.get('/account/address', mustBeUser, (req, res) => {
  OrderServices.showHistoryOrderByIdUser(req.idUser)
  .then(orders => res.render('render/account', { isDetail: 3 }))
  .catch(error => res.render('render/account', { isDetail: 3 }));
});

module.exports = { userRouter };