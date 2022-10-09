const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const {
  list,
  create,
  detail,
  update,
  bulkUpdate,
  remove,
} = require('../controllers/panel');
const { validate } = require('../validators');

// prettier-ignore
{
router.get('/', isAuthenticated, list);
router.post('/', isAuthenticated, validate('createPanel'), create);
router.get('/:id', isAuthenticated, validate('readPanel'), detail);
router.patch('/bulk', isAuthenticated, bulkUpdate);
router.patch('/:id', isAuthenticated, validate('readPanel'), update);
router.delete('/:id', isAuthenticated, validate('readPanel'), remove);
}

module.exports = router;