const express = require('express');
const createHttpError = require('http-errors');
const cors = require('cors');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { validationResult } = require('express-validator');
const User = require('./models/user.model');
const { connectToDb } = require('./db/config');
const roles = require('./utils/constant');
const { registerValidators } = require('./utils/validators');

connectToDb();

const app = express();

app.use(cors());

app.use(express.json());

const jwtKey = 'fairyworld';

app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));

// app.use('/', (req, res, next) => {
//   next(createHttpError.NotFound());
// });

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status);
  res.send(err);
});

app.post('/register', registerValidators, async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.send(errors);
  } else {
    let user = new User(req.body);

    let result = await user.save();

    Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        res.send('Something went wrong, please try after some time');
      }

      const hashPassword = bcrypt.hashSync(result.password, 10);
      result.password = hashPassword;
      if (result.email == process.env.ADMIN_EMAIL) {
        result.role = roles.admin;
      }
      result = result.toObject();
      res.status(200).json({ result, auth: token });
    });
  }
});

app.post('/login', registerValidators, async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors);
  } else {
    let result = await User.findOne(req.body).select('-password');

    if (result !== null) {
      Jwt.sign({ result }, jwtKey, { expiresIn: '2h' }, (error, token) => {
        if (error) {
          console.log('error', error);
          res.send('Something went wrong , please try again after some time');
        } else {
          if (result.email == process.env.ADMIN_EMAIL) {
            result.role = roles.admin;
          }
          res.send({ result, auth: token });
        }
      });
    } else {
      res.send('User not found');
    }
  }
});

const PORT = process.env.PORT || 9009;

app.listen(PORT);
