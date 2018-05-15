const { Router } = require('express');
const { CategoryServices } = require('../services/category.services');
const parser = require('body-parser');

const categoryRouter = Router();

categoryRouter.use(parser.urlencoded({extended: false}));
categoryRouter.use(parser.json());

categoryRouter.get('/:id', (req, res) => {
  CategoryServices.showBookWithIDCategory(req.params.id)
  .then(results => res.render('render/items', { results }))
  .catch(error => res.send(error.message));
});

module.exports = { categoryRouter };