const { ac } = require('../config/grants');
const { User, Role } = require('../models');

async function list(req, res, next) {
  try {
    const { user } = req;
    const permission = ac.can(user.role).readAny('users');
    if (permission.granted) {
      const users = await User.findAll();
      res.json(users);
    } else {
      res.sendStatus(403);
    }
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
      res.json(newUser);
    } else {
      res.sendStatus(403);
    }
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
      if (user) {
        return res.json(user);
      } else {
        res.sendStatus(204);
      }
    } else {
      res.sendStatus(403);
    }
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
      res.json({ updatedRows });
    } else {
      res.sendStatus(403);
    }
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
      res.json({ deleted });
    } else {
      res.sendStatus(403);
    }
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
