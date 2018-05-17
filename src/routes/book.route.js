const { Router } = require('express');
const { BookServices } = require('../services/book.services');

const bookRouter = Router();

bookRouter.get('/:id', (req, res) => {
  BookServices.showBookInfo(req.params.id)
  .then(results => res.render('render/detail', { results }))
  .catch(error => res.send(error.message));
});

// Handle route /book/price?start=&end=&page=
bookRouter.get('/price/filter', (req, res) => {
  const {start, end, page} = req.query;
  const path = `/book/price/filter?start=${start}&end=${end}&page=`;  
  if(!start || !end) return res.redirect('/error');
  BookServices.showBookWithPrice(page, start, end)
  .then(results => res.render('render/items-search', { results, page, path }))
  .catch(error => res.send(error.message));
});


module.exports = { bookRouter };