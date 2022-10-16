const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { detail } = require('../controllers/dashboard');
const { validate } = require('../config/validator');

router.get(
  '/:id', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  detail
);

module.exports = router;
