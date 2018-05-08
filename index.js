const express = require('express');
const parser = require('body-parser').urlencoded({extended: false});

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

app.get('/account', (req, res) => {
  res.render('render/account');
});

app.post('/signin', parser, (req, res) => {
  const {email, password} = req.body;
  if(email === 'aaa' && password === '123') return res.send({success: true});
  res.send({success: false});
});

app.listen(3000, () => console.log('Server started port 3000'));
require('reload')(app);