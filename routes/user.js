const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { list, create, detail, update, remove } = require('../controllers/user');
const { validate } = require('../validators');

router.get('/', isAuthenticated, list);
router.post('/', isAuthenticated, validate('createUser'), create);
router.get('/:id', isAuthenticated, validate('retrieveUser'), detail);
router.put('/:id', isAuthenticated, validate('retrieveUser'), update);
router.delete('/:id', isAuthenticated, validate('retrieveUser'), remove);

module.exports = router;
