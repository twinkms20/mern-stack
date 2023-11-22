const router = require('express').Router();

router.get('/profile', async (req, res) => {
  res.send('profile of user');
});

module.exports = router;
