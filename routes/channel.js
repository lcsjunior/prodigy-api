const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const {
  list,
  create,
  detail,
  update,
  remove,
} = require('../controllers/channel');
const { validate } = require('../validators');

router.get('/', isAuthenticated, list);
router.post('/', isAuthenticated, validate('createChannel'), [create, detail]);
router.get('/:id', isAuthenticated, validate('readChannel'), detail);
router.patch('/:id', isAuthenticated, validate('readChannel'), [
  update,
  detail,
]);
router.delete('/:id', isAuthenticated, validate('readChannel'), remove);

module.exports = router;
