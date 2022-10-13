const express = require('express');
const { body, param } = require('express-validator');
const { checkPerm } = require('../config/grants');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { validate } = require('../config/validator');
const {
  checkEmailExists,
  checkUsernameExists,
  canRead,
  canReadAll,
  canUpdate,
  canDelete,
  list,
  create,
  detail,
  update,
  remove,
} = require('../controllers/user');

router.get(
  '/', //
  isAuthenticated,
  checkPerm(canReadAll),
  list
);
router.post(
  '/',
  isAuthenticated,
  validate([
    body('email').isEmail().custom(checkEmailExists),
    body('username').isLength({ min: 6 }).custom(checkUsernameExists),
    body('password').isLength({ min: 6 }),
  ]),
  create
);
router.get(
  '/:id', //
  isAuthenticated,
  param('id').isInt().toInt(),
  checkPerm(canRead),
  detail
);
router.patch(
  '/:id',
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  checkPerm(canUpdate),
  update
);
router.delete(
  '/:id', //
  isAuthenticated,
  param('id').isInt().toInt(),
  checkPerm(canDelete),
  remove
);

module.exports = router;
