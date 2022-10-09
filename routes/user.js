const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { list, create, detail, update, remove } = require('../controllers/user');
const { checkPermission } = require('../permissions');
const { validate } = require('../validators');

// prettier-ignore
{
router.get('/', isAuthenticated, checkPermission('readAnyUser'), list);
router.post('/', isAuthenticated, validate('createUser'), create);
router.get('/:id', isAuthenticated, checkPermission('readOwnUser'), validate('readUser'), detail);
router.patch( '/:id', isAuthenticated, checkPermission('updateOwnUser'), validate('updateUser'), update);
router.delete( '/:id', isAuthenticated, checkPermission('deleteOwnUser'), validate('readUser'), remove);
}

module.exports = router;
