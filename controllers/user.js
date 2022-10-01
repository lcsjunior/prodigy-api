const { User, Role } = require('../models');

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
    res.json(newUser);
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
    const { body, params } = req;
    const [updatedRows] = await User.update(
      {
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
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
  list,
  create,
  detail,
  update,
  remove,
};
