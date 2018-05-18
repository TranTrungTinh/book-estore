const { Router } = require('express');
const { HomeServices } = require('../services/home.services');
const { priceFormat, priceDiscount, discount } = require('../helpers/priceFormat');

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
  HomeServices.show()
  .then(results => res.render('render/index', { results, price: {priceFormat, priceDiscount, discount} }))
  .catch(error => res.send(error.message));
});

module.exports = {homeRouter};