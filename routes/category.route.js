const { Router } = require('express');
const { CategoryServices } = require('../services/category.services');
const parser = require('body-parser');

const categoryRouter = Router();

categoryRouter.use(parser.urlencoded({extended: false}));
categoryRouter.use(parser.json());

categoryRouter.get('/:id', (req, res) => {
  const path = `/category/${req.params.id}?page=`;
  const {page} = req.query;
  CategoryServices.showBookWithIDCategory(page, req.params.id)
  .then(results => res.render('render/items', { results, path, page }))
  .catch(error => res.send(error.message));
});

categoryRouter.get('/author/:id', (req, res) => {
  CategoryServices.showBookWithIDAuthor(req.params.id)
  .then(results => res.render('render/items', { results }))
  .catch(error => res.send(error.message));
});

categoryRouter.get('/publisher/:id', (req, res) => {
  CategoryServices.showBookWithIDPublisher(req.params.id)
  .then(results => res.render('render/items', { results }))
  .catch(error => res.send(error.message));
});

module.exports = { categoryRouter };