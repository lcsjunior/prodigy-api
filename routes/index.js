const express = require('express');
const router = express.Router();
const { index } = require('../controllers/index');
const { login, logout, detailUser } = require('../controllers/auth');
const { passport, isAuthenticated } = require('../config/passport');

router.get('/', index);
router.get('/user', isAuthenticated, detailUser);
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: null,
  }),
  login
);
router.post('/logout', logout);

module.exports = router;
