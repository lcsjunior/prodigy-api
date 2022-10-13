const { User, Role } = require('../models');
const { ac } = require('../config/grants');
const { messages } = require('../utils/messages');

const checkEmailExists = async (value) => {
  const user = await User.findOne({
    raw: true,
    paranoid: false,
    attributes: ['id'],
    where: { email: value },
  });
  if (user) {
    return Promise.reject(messages.alreadyInUse);
  }
};

const checkUsernameExists = async (value) => {
  const user = await User.findOne({
    raw: true,
    paranoid: false,
    attributes: ['id'],
    where: { username: value },
  });
  if (user) {
    return Promise.reject(messages.alreadyInUse);
  }
};

const canReadAll = ({ user }) => {
  const permission = ac.can(user.role).readAny('users');
  return permission.granted;
};

const canRead = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).readOwn('users')
      : ac.can(user.role).readAny('users');
  return permission.granted;
};

const canUpdate = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).updateOwn('users')
      : ac.can(user.role).updateAny('users');
  return permission.granted;
};

const canDelete = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).deleteOwn('users')
      : ac.can(user.role).deleteAny('users');
  return permission.granted;
};

const list = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const userRole = await Role.findOne({ where: { slug: 'user' } });
    const newUser = await User.create({
      roleId: userRole.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      username: body.username,
      password: body.password,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findByPk(params.id);
    if (user) {
      return res.json(user);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { params, body } = req;
    const [updatedRows] = await User.update(
      {
        firstName: body.firstName,
        lastName: body.lastName,
      },
      { where: { id: params.id }, individualHooks: true }
    );
    res.json({ updatedRows });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { params } = req;
    const deleted = await User.destroy({ where: { id: params.id } });
    res.json({ deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkEmailExists,
  checkUsernameExists,
  canReadAll,
  canRead,
  canUpdate,
  canDelete,
  list,
  create,
  detail,
  update,
  remove,
};
