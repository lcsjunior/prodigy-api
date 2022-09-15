const { ac } = require('../config/grants');
const { User, Role } = require('../models');

async function list(req, res, next) {
  try {
    const { user } = req;
    const permission = ac.can(user.role).readAny('users');
    if (permission.granted) {
      const users = await User.findAll();
      return res.json(users);
    }
    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { user, body } = req;
    const permission = ac.can(user.role).createAny('users');
    if (permission.granted) {
      const userRole = await Role.findOne({ where: { slug: 'user' } });
      const newUser = await User.create({
        roleId: userRole.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        username: body.username,
        password: body.password,
      });
      return res.json(newUser);
    }
    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const { user, params } = req;
    const permission =
      user.id === params.id
        ? ac.can(user.role).readOwn('users')
        : ac.can(user.role).readAny('users');
    if (permission.granted) {
      const user = await User.findByPk(params.id);
      return res.json(user);
    }
    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { user, body, params } = req;
    const permission =
      user.id === params.id
        ? ac.can(user.role).updateOwn('users')
        : ac.can(user.role).updateAny('users');
    if (permission.granted) {
      const [updatedRows] = await User.update(
        {
          firstName: body.firstName,
          lastName: body.lastName,
          password: body.password,
        },
        { where: { id: params.id }, individualHooks: true }
      );
      return res.json({ updatedRows });
    }
    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { user, params } = req;
    const permission = ac.can(user.role).deleteAny('users');
    if (permission.granted) {
      const deleted = await User.destroy({ where: { id: params.id } });
      return res.json({ deleted });
    }
    res.sendStatus(403);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  create,
  detail,
  update,
  remove,
};
