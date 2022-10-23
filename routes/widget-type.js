const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { list } = require('../controllers/widget-type');

router.get('/', isAuthenticated, list);

module.exports = router;
