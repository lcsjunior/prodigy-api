const express = require('express');
const { query, param, body } = require('express-validator');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { validate } = require('../config/validator');
const { checkPanelOwnership } = require('../controllers/panel');
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
  validate(query('panelId').isInt().toInt()),
  checkPanelOwnership,
  list
);
router.post(
  '/',
  isAuthenticated,
  validate([
    query('panelId').isInt().toInt(),
    body('typeId').isInt().toInt(),
    body('chId').isInt().toInt(),
    body('fieldX').isInt().toInt(),
  ]),
  checkPanelOwnership,
  [create, detail]
);
router.get(
  '/:id',
  isAuthenticated,
  validate([param('id').isInt().toInt(), query('panelId').isInt().toInt()]),
  checkPanelOwnership,
  detail
);
router.patch(
  '/:id',
  isAuthenticated,
  validate([
    param('id').isInt().toInt(),
    query('panelId').isInt().toInt(),
    body('chId').isInt().toInt(),
    body('fieldX').isInt().toInt(),
  ]),
  checkPanelOwnership,
  [update, detail]
);
router.delete(
  '/:id',
  isAuthenticated,
  validate([param('id').isInt().toInt(), query('panelId').isInt().toInt()]),
  checkPanelOwnership,
  remove
);

module.exports = router;
