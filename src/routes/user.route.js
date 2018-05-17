const { Router } = require('express');
const { UserServices } = require('../services/user.services');
const parser = require('body-parser');

const userRouter = Router();

userRouter.use(parser.urlencoded({extended: false}));
userRouter.use(parser.json());

userRouter.post('/signup', (req, res) => {
  UserServices.signUp(req.body)
  .then(user => res.send({ success: true, user }))
  .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = {userRouter};