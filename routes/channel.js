const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const {
  list,
  create,
  detail,
  update,
  remove,
} = require('../controllers/channel');

router.get('/', isAuthenticated, list);
router.post('/', isAuthenticated, create);
router.get('/:id', isAuthenticated, param('id').toInt(), detail);
router.put('/:id', isAuthenticated, param('id').toInt(), update);
router.delete('/:id', isAuthenticated, param('id').toInt(), remove);

module.exports = router;
