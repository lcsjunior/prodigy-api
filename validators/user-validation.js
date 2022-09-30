const { param, body } = require('express-validator');

const retrieveUser = () => {
  return [param('id').isInt().toInt()];
};

const createUser = () => {
  return [
    body('email').isEmail(),
    body('username').isLength({ min: 6 }),
    body('password').isLength({ min: 6 }),
  ];
};

module.exports = {
  retrieveUser,
  createUser,
};
