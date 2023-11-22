const express = require('express');
const { connectToDb } = require('./db/config');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const { validationResult } = require('express-validator');
const { registerValidators } = require('./utils/validators');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

connectToDb();

const app = express();

app.use(express.json());

app.use(cors());

const jwtKey = 'yummtumm';

app.post('/register', registerValidators, async (req, res) => {
  let error = validationResult(req);

  if (!error.isEmpty()) {
    res.send(error);
  } else {
    let user = new User(req.body);

    let result = await user.save();

    Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        res.status(400).send({
          errors: [{ msg: 'Something went wrong , please try after sometime' }],
        });
      }

      const hashPassword = bcrypt.hashSync(result.password, 10);
      result.password = hashPassword;
      result = result.toObject();
      res.status(200).json({ result, auth: token });
    });
  }
});

app.post('/login', registerValidators, async (req, res) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    res.send(error);
  } else {
    let result = await User.findOne(req.body);

    if (result !== null) {
      Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
        if (err) {
          res.status(400).send({
            errors: [
              { msg: 'Something went wrong , please try after sometime' },
            ],
          });
        } else {
          const hashPassword = bcrypt.hashSync(result.password, 10);
          result.password = hashPassword;
          res.send({ result, auth: token });
        }
      });
    } else {
      res.status(400).send({ errors: [{ msg: 'User not found' }] });
    }
  }
});

app.post('/getAllData', verifyToken, async (req, res) => {
  let products;
  if (req.body.name === '') {
    products = await Product.find({});
  } else {
    products = await Product.find({
      $or: [{ name: { $regex: req.body.name } }],
    });
  }
  if (products?.length > 0) {
    res.send(products);
  } else {
    res.send([]);
  }
});

app.post('/placeOrder', verifyToken, async (req, res) => {
  let emailId = await Order.findOne({ email: req.body.email });
  if (emailId === null) {
    let order = new Order(req.body);
    let result = await order.save();
    if (result !== null) {
      res.send({ message: 'Your order is placed' });
    } else {
      res.send({
        errors: [{ msg: 'Something went wrong' }],
        order_data: result,
      });
    }
  } else {
    let result = await Order.findOneAndUpdate(
      { email: req.body.email },
      { $push: { order_data: req.body.order_data } }
    );
    if (result !== null) {
      res.send({ message: 'Your order is placed' });
    } else {
      res.send({
        errors: [{ msg: 'Something went wrong' }],
        order_data: result,
      });
    }
  }
});

function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    Jwt.verify(token, jwtKey, (err) => {
      if (err) {
        res.send({
          errors: [{ msg: 'Please provide valid token' }],
        });
      } else {
        next();
      }
    });
  } else {
    res.send({ errors: [{ msg: 'Please provide token with valid headers' }] });
  }
}

app.listen(process.env.PORT);
