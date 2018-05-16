const { Router } = require('express');
const { BookServices } = require('../services/book.services');

const bookRouter = Router();

bookRouter.get('/:id', (req, res) => {
  BookServices.show(req.params.id)
  .then(results => res.render('render/detail', { results }))
  .catch(error => res.send(error.message));
});

module.exports = { bookRouter };