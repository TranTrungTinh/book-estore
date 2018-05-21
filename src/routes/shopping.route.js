const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { checkToken } = require('../middleware/mustBeUser.middleware');
const { shoppingServices } = require('../services/shopping.services');
const { priceDiscount, priceFormat, discount } = require('../helpers/priceFormat');

const shoppingRouter = Router();

shoppingRouter.use(parser.urlencoded({extended: false}));
shoppingRouter.use(parser.json());
shoppingRouter.use(cookieParser());
shoppingRouter.use(checkToken)

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
shoppingRouter.post('/update', (req, res) => {
  const { idBook, amount } = req.body;
  const count = amount ? amount : 1;

  shoppingServices.updateItem(req.idUser, idBook, count)
  .then(count => res.send({ success: true, count }))
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = { shoppingRouter };