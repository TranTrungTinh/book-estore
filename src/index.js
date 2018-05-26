const express = require('express');
const { homeRouter } = require('./routes/home.route');
const { categoryRouter } = require('./routes/category.route');
const { bookRouter } = require('./routes/book.route');
const { userRouter } = require('./routes/user.route');
const { shoppingRouter } = require('./routes/shopping.route');
const { adminRouter } = require('./routes/admin.route');

const app = express();

app.set('view engine', 'ejs');
app.set('views' , './src/views');
app.use(express.static('src/public'));

app.use('/home', homeRouter);
app.use('/category', categoryRouter);
app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/shopping-cart', shoppingRouter);
app.use('/admin', adminRouter);


app.get('/', (req, res) => res.redirect('/home'));

app.get('/admin', (req, res) => {
  res.render('render/admin');
});


// handle error route
app.get('/error', (req, res) => res.render('render/error'));
app.get('*', (req, res) => res.redirect('/error'));

app.listen(3000, () => console.log('Server started port 3000'));