const { param, body } = require('express-validator');

const retrieveChannel = () => {
  return [param('id').isInt().toInt()];
};

const createChannel = () => {
  return [body('channelId').not().isEmpty().bail().isInt().toInt()];
};

module.exports = {
  retrieveChannel,
  createChannel,
};
