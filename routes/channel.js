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
router.post('/', isAuthenticated, validate('createChannel'), create);
router.get('/:id', isAuthenticated, validate('retrieveChannel'), detail);
router.put('/:id', isAuthenticated, validate('retrieveChannel'), update);
router.delete('/:id', isAuthenticated, validate('retrieveChannel'), remove);

module.exports = router;
