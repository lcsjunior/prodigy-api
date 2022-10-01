const { param, body } = require('express-validator');

const createChannel = () => {
  return [body('channelId').not().isEmpty().bail().isInt().toInt()];
};

const readChannel = () => {
  return [param('id').isInt().toInt()];
};

module.exports = {
  createChannel,
  readChannel,
};
