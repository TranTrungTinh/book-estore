const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { AdminServices } = require('../services/admin.services');
const { mustBeAdmin, checkTokenAdmin } = require('../middleware/mustBeAdmin.middleware');
const { priceFormat } = require('../helpers/priceFormat');
const { upload } = require('../helpers/upload');
const { checkExistsAndDelete } = require('../helpers/checkExistsAndDelete');

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
           res.send({ success: false })
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

adminRouter.post('/logout', (req, res) => {
  const { ADMIN } = req.cookies;
  if(!ADMIN) return res.send({ success: false });
  res.clearCookie('ADMIN');
  res.send({ success: true });
});


adminRouter.post('/savebook', (req, res) => {
  upload.single('image')(req, res, error => {
    if (error) return res.send({ success: false, message: error.message });
    if (req.file) {
      const dotIndex = req.file.filename.lastIndexOf('.');
      const id = req.file.filename.substring(0, dotIndex);
      const bookInfo = {...req.body};
      bookInfo.id = id;
      bookInfo.image = req.file.filename;
      AdminServices.saveBook(bookInfo)
      .then(() => res.send({ success: true, filename: bookInfo.image }))
      .catch(error => res.send({ success: false, message: error.message }));
    }
  });
});

adminRouter.post('/updatebook/:idBook', (req, res) => {
  upload.single('image')(req, res, error => {
    if (error) return res.send({ success: false, message: error.message });

    const bookInfo = {...req.body};
    if (req.file) bookInfo.image = req.file.filename;
    else bookInfo.image = bookInfo.imagePath;
    AdminServices.updateBookInfo(bookInfo)
    .then(res.send({ success: true, filename: bookInfo.image }))
    .catch(error => res.send({ success: false, message: error.message }));
  });
});

adminRouter.post('/saveauthor', (req, res) => {
  const { authorName } = req.body
  AdminServices.saveAuthor(authorName)
  .then(newId => res.send({ success: true, newId }))
  .catch(err => res.send({ success: false }));
});

adminRouter.post('/savecat', (req, res) => {
  const { catName } = req.body
  AdminServices.saveCategory(catName)
  .then(newId => res.send({ success: true, newId }))
  .catch(err => res.send({ success: false }));
});

adminRouter.post('/savepublisher', (req, res) => {
  const { publisherName } = req.body
  AdminServices.savePublisher(publisherName)
  .then(newId => res.send({ success: true, newId }))
  .catch(err => res.send({ success: false }));
});

adminRouter.post('/updateorder', (req, res) => {
  const { orderId, orderStt } = req.body;
  AdminServices.updateOrderInfo({ orderId, orderStt })
  .then((updatedId) => {
    if(updatedId) res.send({ success: true })
    else res.send({ success: false, message: 'ID_NOT_FOUND' })
  })
  .catch(err => res.send({ success: false, message: 'ERROR_QUERYING_DATABASE' }));
});

adminRouter.post('/updateauthor', (req, res) => {
  const { authorId, authorName } = req.body
  AdminServices.updateAuthorInfo({ authorId, authorName })
  .then((updatedId) => {
    if(updatedId) res.send({ success: true })
    else res.send({ success: false, message: 'ID_NOT_FOUND' })
  })
  .catch(err => res.send({ success: false, message: 'ERROR_QUERYING_DATABASE' }));
});

adminRouter.post('/updatecat', (req, res) => {
  const { catId, catName } = req.body
  AdminServices.updateCategoryInfo({ catId, catName })
  .then((updatedId) => {
    if(updatedId) res.send({ success: true })
    else res.send({ success: false, message: 'ID_NOT_FOUND' })
  })
  .catch(err => res.send({ success: false, message: 'ERROR_QUERYING_DATABASE' }));
});

adminRouter.post('/updatepublisher', (req, res) => {
  const { publisherId, publisherName } = req.body
  AdminServices.updatePublisherInfo({ publisherId, publisherName })
  .then((updatedId) => {
    if(updatedId) res.send({ success: true })
    else res.send({ success: false, message: 'ID_NOT_FOUND' })
  })
  .catch(err => res.send({ success: false, message: 'ERROR_QUERYING_DATABASE'}));
});

adminRouter.post('/deletebook', (req, res) => {
  const { bookId } = req.body
  AdminServices.deleteBookInfo({ bookId })
  .then((deletedId) => {
    if(deletedId) res.send({ success: true })
    else res.send({ success: false, message: 'ID_NOT_FOUND' })
  })
  .catch(err => res.send({ success: false, message: 'ERROR_QUERYING_DATABASE' }));
});

adminRouter.get('/refreshproducts', (req, res) => {
  AdminServices.showBooks()
  .then(data => res.send({ data }))
  .catch(err => {
    console.log(err)
    res.send({ message: 'ERROR_QUERYING_DATABASE' })
  })
})

adminRouter.get('/refreshorders', (req, res) => {
  AdminServices.showOrders()
  .then(data => res.send({ data }))
  .catch(err => {
    console.log(err)
    res.send({ message: 'ERROR_QUERYING_DATABASE' })
  })
})

adminRouter.get('/refreshauthors', (req, res) => {
  AdminServices.showAuthors()
  .then(data => res.send({ data }))
  .catch(err => {
    console.log(err)
    res.send({ message: 'ERROR_QUERYING_DATABASE' })
  })
})

adminRouter.get('/refreshcats', (req, res) => {
  AdminServices.showCategories()
  .then(data => res.send({ data }))
  .catch(err => {
    console.log(err)
    res.send({ message: 'ERROR_QUERYING_DATABASE' })
  })
})

adminRouter.get('/refreshpublishers', (req, res) => {
  AdminServices.showPublishers()
  .then(data => res.send({ data }))
  .catch(err => {
    console.log(err)
    res.send({ message: 'ERROR_QUERYING_DATABASE' })
  })
})


module.exports = { adminRouter }