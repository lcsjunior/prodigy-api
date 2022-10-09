const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const {
  list,
  create,
  detail,
  update,
  remove,
} = require('../controllers/widget');
const { validate } = require('../validators');

// prettier-ignore
{
router.get('/', isAuthenticated, validate('readAllWidget'), list);
router.post('/', isAuthenticated, validate('createWidget'), [create, detail]);
router.get('/:id', isAuthenticated, validate('readWidget'), detail);
router.patch('/:id', isAuthenticated, validate('readWidget'), [update, detail]);
router.delete('/:id', isAuthenticated, validate('readWidget'), remove);
}

module.exports = router;
