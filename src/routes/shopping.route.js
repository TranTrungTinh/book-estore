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


shoppingRouter.get('/', checkToken, (req, res) => {
  const price = { priceDiscount, priceFormat, discount };
  shoppingServices.getItem(req.idUser)
  .then(carts => res.render('render/payment', { carts, price}))
  .catch(error => res.render('render/payment',{ carts: [], price}));
});
shoppingRouter.post('/cart', checkToken, (req, res) => {
  shoppingServices.saveItem(req.idUser, req.body.idBook)
  .then(count => res.send({ success: true, count }))
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = { shoppingRouter };