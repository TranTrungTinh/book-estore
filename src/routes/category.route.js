const { Router } = require('express');
const { CategoryServices } = require('../services/category.services');

const categoryRouter = Router();


categoryRouter.get('/:id', (req, res) => {
  const path = `/category/${req.params.id}?page=`;
  const {page} = req.query;
  CategoryServices.showBookWithIDCategory(page, req.params.id)
  .then(results => res.render('render/items', { results, path, page }))
  .catch(error => res.send(error.message));
});

categoryRouter.get('/author/:id', (req, res) => {
  const path = `/category/author/${req.params.id}?page=`;
  const {page} = req.query;
  CategoryServices.showBookWithIDAuthor(page, req.params.id)
  .then(results => res.render('render/items', { results, path, page }))
  .catch(error => res.send(error.message));
});

categoryRouter.get('/publisher/:id', (req, res) => {
  const path = `/category/publisher/${req.params.id}?page=`;
  const {page} = req.query;
  CategoryServices.showBookWithIDPublisher(page, req.params.id)
  .then(results => res.render('render/items', { results, path, page }))
  .catch(error => res.send(error.message));
});

module.exports = { categoryRouter };