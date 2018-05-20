const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { checkToken } = require('../middleware/mustBeUser.middleware');
const { shoppingServices } = require('../services/shopping.services');

const shoppingRouter = Router();

shoppingRouter.use(parser.urlencoded({extended: false}));
shoppingRouter.use(parser.json());
shoppingRouter.use(cookieParser());


shoppingRouter.get('/', (req, res) => res.render('render/payment'));
shoppingRouter.post('/cart', checkToken, (req, res) => {
  shoppingServices.saveItem(req.idUser, req.body.idBook)
  .then(() => res.send({ success: true }))
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = { shoppingRouter };