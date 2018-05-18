const { Router } = require('express');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

const { UserServices } = require('../services/user.services');
const { mustBeUser } = require('./mustBeUser.middleware');
const { mustCheckCaptcha } = require('./mustCheckCaptcha.middleware');

const userRouter = Router();

userRouter.use(parser.urlencoded({extended: false}));
userRouter.use(parser.json());
userRouter.use(cookieParser());

userRouter.post('/signup', mustCheckCaptcha, (req, res) => {
  UserServices.signUp(req.body)
  .then(user => res.send({ success: true, user }))
  .catch(error => res.send({ success: false, message: error.message }));
});

userRouter.post('/signin', mustBeUser, (req, res) => {
  const { email, password } = req.body;
  UserServices.signIn(email, password)
  .then(user => {
    res.cookie('TOKEN', user.TOKEN);
    res.send({ success: true, user });
  })
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = {userRouter};