const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { isAuthenticated } = require('../config/passport');
const { validate } = require('../config/validator');
const {
  list,
  create,
  detail,
  update,
  bulkUpdate,
  remove,
} = require('../controllers/panel');

router.get(
  '/', //
  isAuthenticated,
  list
);
router.post(
  '/', //
  isAuthenticated,
  validate(body('name').not().isEmpty()),
  [create, detail]
);
router.get(
  '/:id', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  detail
);
router.patch(
  '/bulk', //
  isAuthenticated,
  bulkUpdate
);
router.patch(
  '/:id', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  [update, detail]
);
router.delete(
  '/:id', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  remove
);

module.exports = router;
