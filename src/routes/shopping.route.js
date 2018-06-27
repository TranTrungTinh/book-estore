const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { mustBeUser } = require('../middleware/mustBeUser.middleware');
const { shoppingServices } = require('../services/shopping.services');
const { OrderServices } = require('../services/order.services');
const { priceDiscount, priceFormat, discount } = require('../helpers/priceFormat');

const shoppingRouter = Router();

shoppingRouter.use(parser.urlencoded({extended: false}));
shoppingRouter.use(parser.json());
shoppingRouter.use(cookieParser());
shoppingRouter.use(mustBeUser);

shoppingRouter.get('/', (req, res) => {
  const price = { priceDiscount, priceFormat, discount };
  shoppingServices.getItem(req.idUser)
  .then(carts => res.render('render/payment', { carts, price}))
  .catch(error => res.render('render/payment',{ carts: [], price}));
});
shoppingRouter.post('/cart', (req, res) => {
  const { idBook, amount } = req.body;
  const count = amount ? amount : 1;

  shoppingServices.saveItem(req.idUser, idBook, count)
  .then(count => res.send({ success: true, count }))
  .catch(error => res.send({ success: false, message: error.message }));
});
shoppingRouter.post('/amount', (req, res) => {
  shoppingServices.isEnoughAmount(req.body.idBook)
  .then(amount => res.send({ success: true, amount }))
  .catch(error => res.send({ success: false, message: error.message }));
});
shoppingRouter.post('/update', (req, res) => {
  const { idBook, amount } = req.body;
  const count = amount ? amount : 1;

  shoppingServices.updateItem(req.idUser, idBook, count)
  .then(count => res.send({ success: true, count }))
  .catch(error => res.send({ success: false, message: error.message }));
});
shoppingRouter.post('/delete', (req, res) => {
  const { idBook } = req.body;

  shoppingServices.deleteItem(req.idUser, idBook)
  .then(count => res.send({ success: true, count }))
  .catch(error => res.send({ success: false, message: error.message }));
});

shoppingRouter.post('/order', (req, res) => {
  OrderServices.saveOrderByIdUser(req.idUser, req.body.total)
  .then(() => res.send({ success: true }))
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = { shoppingRouter };