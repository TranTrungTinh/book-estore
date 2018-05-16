const express = require('express');
const { homeRouter } = require('./routes/home.route');
const { categoryRouter } = require('./routes/category.route');
const { bookRouter } = require('./routes/book.route');

const app = express();

app.set('view engine', 'ejs');
app.set('views' , './src/views');
app.use(express.static('src/public'));
app.use('/home', homeRouter);
app.use('/category', categoryRouter);
app.use('/book', bookRouter);


app.get('/', (req, res) => res.redirect('/home'));

// app.get('/category/technology', (req, res) => {
//   res.render('render/items');
// });

// app.get('/book', (req, res) => {
//   res.render('render/detail');
// });

// app.get('/shopping-cart', (req, res) => {
//   res.render('render/payment');
// });

// app.get('/account', (req, res) => {
//   res.render('render/account');
// });

app.get('/admin', (req, res) => {
  res.render('render/admin');
});

// app.post('/signin', parser, (req, res) => {
//   const {email, password} = req.body;
//   if(email === 'aaa' && password === '123') return res.send({success: true});
//   res.send({success: false});
// });

app.listen(3000, () => console.log('Server started port 3000'));
require('reload')(app);

// handle error route
app.get('/error', (req, res) => res.render('render/error'));
app.get('*', (req, res) => res.redirect('/error'));
