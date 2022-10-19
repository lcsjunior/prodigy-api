const express = require('express');
const { query, param, body } = require('express-validator');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { validate } = require('../config/validator');
const { isOwnerChannel, checkFieldNumber } = require('../controllers/channel');
const {
  list,
  create,
  detail,
  update,
  remove,
} = require('../controllers/widget');

router.get(
  '/',
  isAuthenticated,
  validate(query('chId').isInt().toInt()),
  isOwnerChannel,
  list
);
router.post(
  '/',
  isAuthenticated,
  validate([
    query('chId').isInt().toInt(),
    body('typeId').isInt().toInt(),
    body('fields').isArray().custom(checkFieldNumber),
  ]),
  isOwnerChannel,
  [create, detail]
);
router.get(
  '/:id',
  isAuthenticated,
  validate([param('id').isInt().toInt(), query('chId').isInt().toInt()]),
  isOwnerChannel,
  detail
);
router.patch(
  '/:id',
  isAuthenticated,
  validate([
    param('id').isInt().toInt(),
    query('chId').isInt().toInt(),
    body('fields').isArray().custom(checkFieldNumber),
  ]),
  isOwnerChannel,
  [update, detail]
);
router.delete(
  '/:id',
  isAuthenticated,
  validate([param('id').isInt().toInt(), query('chId').isInt().toInt()]),
  isOwnerChannel,
  remove
);

module.exports = router;
