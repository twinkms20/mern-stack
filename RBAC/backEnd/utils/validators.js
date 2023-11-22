const { body } = require('express-validator');

module.exports = {
  registerValidators: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email must be a valid email')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .trim()
      .isLength(4)
      .withMessage('Password length must be greater than 3 character'),
  ],
};
