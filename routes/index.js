const express = require('express');
const router = express.Router();
const passport = require('passport');
const { index } = require('../controllers/index');
const { login, logout } = require('../controllers/auth');

router.get('/', index);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: null,
  }),
  login
);
router.post('/logout', logout);

module.exports = router;
