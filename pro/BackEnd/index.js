const express = require('express');
require('./db/config');
const User = require('./db/User');
const cors = require('cors');
const Product = require('./db/Product');
const Jwt = require('jsonwebtoken');

const jwtKey = 'fairylan';

const app = express();

app.use(cors());

app.use(express.json());

app.post('/register', async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
    if (err) {
      res.send('Something went wrong, please try after some time');
    }
    res.send({ result, auth: token });
  });
});

app.post('/login', async (req, res) => {
  if (!req.body.password) {
    res.send('Password field is required');
  } else if (!req.body.email) {
    res.send('Email field is required');
  } else {
    let result = await User.findOne(req.body).select('-password');
    Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        res.send('Something went wrong, please try after some time');
      }
      res.send({ result, auth: token });
    });
  }
});

app.post('/add-product', verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.post('/products', verifyToken, async (req, res) => {
  let products;
  if (req.body.name === '' && req.body.price === '') {
    products = await Product.find();
  } else {
    products = await Product.find({
      $or: [{ name: { $regex: req.body.name } }],
    });
  }
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send([]);
  }
});

app.delete('/product/:id', verifyToken, async (req, resp) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get('/product/:id', verifyToken, async (req, resp) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result?.name !== undefined) {
    resp.send(result);
  } else {
    resp.send('No record found');
  }
});

app.put('/product-update/:id', verifyToken, async (req, resp) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: 'Please provide valid token' });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: 'Please add token with headers' });
  }
}

app.listen(9000);
