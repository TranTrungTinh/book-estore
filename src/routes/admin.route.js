const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { AdminServices } = require('../services/admin.services');
const { mustBeAdmin, checkTokenAdmin } = require('../middleware/mustBeAdmin.middleware');
const { priceFormat } = require('../helpers/priceFormat');

const adminRouter = Router();
adminRouter.use(parser.urlencoded({extended: false}));
adminRouter.use(parser.json());
adminRouter.use(cookieParser());

adminRouter.get('/edit', mustBeAdmin, (req, res) => {
  Promise.all([ AdminServices.showBooks(), 
                AdminServices.showOrders(),
                AdminServices.showAuthors(), 
                AdminServices.showCategories(), 
                AdminServices.showPublishers() ])
         .then(results => {
            const booksList      = results[0],
                  ordersList     = results[1],
                  authorsList    = results[2],
                  categoriesList = results[3],
                  publishersList = results[4]
            res.render('render/admin', { isLogin: true, booksList, ordersList, authorsList, categoriesList, publishersList, priceFormat });
          })
         .catch(err => {
           console.log(err)
         })
});

adminRouter.get('/login', checkTokenAdmin, (req, res) => {
  res.render('render/admin', { isLogin: false });
});

adminRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  AdminServices.signInWith(username, password)
  .then(admin => {
    res.cookie('ADMIN', admin.TOKEN);
    res.send({ success: true, message: 'OK'});
  })
  .catch(error => res.send({ success: false }));
});

module.exports = { adminRouter }