const { param, body, query } = require('express-validator');

const createWidget = () => {
  return [
    query('panelId').isInt().toInt(),
    body('display_name').not().isEmpty(),
  ];
};

const readWidget = () => {
  return [param('id').isInt().toInt()];
};

const readAllWidget = () => {
  return [query('panelId').isInt().toInt()];
};

module.exports = {
  createWidget,
  readWidget,
  readAllWidget,
};
