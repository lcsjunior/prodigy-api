const { param, body } = require('express-validator');
const { User } = require('../models');
const { messages } = require('../utils/messages');

const checkEmailExists = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (user) {
    return Promise.reject(messages.alreadyInUse);
  }
};

const checkUsernameExists = async (username) => {
  const user = await User.findOne({ where: { username } });
  if (user) {
    return Promise.reject(messages.alreadyInUse);
  }
};

const retrieveUser = () => {
  return [param('id').isInt().toInt()];
};

const createUser = () => {
  return [
    body('email').isEmail().custom(checkEmailExists),
    body('username').isLength({ min: 6 }).custom(checkUsernameExists),
    body('password').isLength({ min: 6 }),
  ];
};

module.exports = {
  retrieveUser,
  createUser,
};
