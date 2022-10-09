const express = require('express');
const router = express.Router();
const { index } = require('../controllers/index');
const { login, logout, detailUser } = require('../controllers/auth');
const { passport, isAuthenticated } = require('../config/passport');

// prettier-ignore
{
router.get('/', index);
router.get('/user', isAuthenticated, detailUser);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', logout);
}

module.exports = router;
