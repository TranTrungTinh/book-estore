const { Router } = require('express');
const { HomeServices } = require('../services/home.services');

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
  HomeServices.show()
  .then(results => res.render('render/index', { results }))
  .catch(error => res.send(error.message));
});

module.exports = {homeRouter};