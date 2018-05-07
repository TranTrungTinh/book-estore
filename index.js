const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('render/index');
});

app.get('/category/technology', (req, res) => {
  res.render('render/items');
});

app.get('/book', (req, res) => {
  res.render('render/detail');
});

app.get('/shopping-cart', (req, res) => {
  res.render('render/payment');
});

app.listen(3000, () => console.log('Server started port 3000'));
require('reload')(app);