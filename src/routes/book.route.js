const { Router } = require('express');
const { BookServices } = require('../services/book.services');
const { priceFormat, priceDiscount, discount } = require('../helpers/priceFormat');

const bookRouter = Router();

bookRouter.get('/:id', (req, res) => {
  BookServices.showBookInfo(req.params.id)
  .then(results => res.render('render/detail', { results, price: {priceFormat, priceDiscount, discount} }))
  .catch(error => res.render('render/error'));
});

// Handle route /book/price?start=&end=&page=
bookRouter.get('/price/filter', (req, res) => {
  const {start, end, page} = req.query;
  const path = `/book/price/filter?start=${start}&end=${end}&page=`;  
  if(!start || !end || !page) return res.redirect('/error');
  BookServices.showBookWithPrice(page, start, end)
  .then(results => res.render('render/items-search', { results, page, path, price: {priceFormat, priceDiscount, discount} }))
  .catch(error => res.render('render/error'));
});

// Handle route /book/price?start=&end=&page=
bookRouter.get('/name/filter', (req, res) => {
  const {search, page} = req.query;
  const path = `/book/name/filter?search=${search}&page=`;  
  if(!search || !page) return res.redirect('/error');
  BookServices.showBookWithName(page, search)
  .then(results => res.render('render/items-search', { results, page, path, price: {priceFormat, priceDiscount, discount} }))
  .catch(error => res.render('render/error'));
});


module.exports = { bookRouter };