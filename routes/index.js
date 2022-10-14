const express = require('express');
const router = express.Router();
const { index } = require('../controllers/index');
const { login, logout, detailUser } = require('../controllers/auth');
const { passport, isAuthenticated } = require('../config/passport');
const { isDev } = require('../utils/current-env');

router.get('/', index);
router.get('/user', isAuthenticated, detailUser);
router.get('/login', passport.authenticate('basic', { session: isDev }), login);
router.post('/login', passport.authenticate('local'), login);
router.all('/logout', logout);

module.exports = router;
