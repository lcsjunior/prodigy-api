const express = require('express');
const router = express.Router();
const passport = require('passport');
const { index } = require('../controllers/index');
const { login, logout, currentUser } = require('../controllers/auth');
const { isAuthenticated } = require('../config/passport');

router.get('/', index);
router.get('/user', isAuthenticated, currentUser);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: null,
  }),
  login
);
router.post('/logout', logout);

module.exports = router;
