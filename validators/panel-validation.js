const { param, body } = require('express-validator');

const createPanel = () => {
  return [body('name').not().isEmpty()];
};

const readPanel = () => {
  return [param('id').isInt().toInt()];
};

module.exports = {
  createPanel,
  readPanel,
};
