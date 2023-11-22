const router = require('express').Router();

router.get('/login', async (req, res, next) => {
  res.send('login');
});

router.get('/register', async (req, res, next) => {
  res.send('register');
});

router.post('/login', async (req, res, next) => {
  res.send('login');
});

router.post('/register', async (req, res, next) => {
  res.send('register');
});

router.get('/logout', async (req, res, next) => {
  res.send('Logout');
});

module.exports = router;
