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
  remove,
  bulkUpdate,
  readFeeds,
  eventsHandler,
} = require('../controllers/channel');

router.get(
  '/', //
  isAuthenticated,
  list
);
router.post(
  '/', //
  isAuthenticated,
  validate(body('channelId').isInt().toInt()),
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
router.get(
  '/:id/feeds', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  readFeeds
);
router.get(
  '/:id/events', //
  isAuthenticated,
  validate(param('id').isInt().toInt()),
  eventsHandler
);

module.exports = router;
