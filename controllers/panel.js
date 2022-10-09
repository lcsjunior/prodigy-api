const { Panel, sequelize } = require('../models');
const _ = require('lodash');

const list = async (req, res, next) => {
  try {
    const { user } = req;
    const panels = await Panel.findAll({
      where: { userId: user.id },
      order: [['sortOrder', 'ASC']],
    });
    res.json(panels);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { user, body } = req;
    const sortOrder = await Panel.findOne({
      raw: true,
      attributes: [
        [
          sequelize.fn(
            'coalesce',
            sequelize.fn('max', sequelize.col('sort_order')),
            0
          ),
          'max',
        ],
      ],
      where: { userId: user.id },
    });
    const newPanel = await Panel.create({
      userId: user.id,
      name: body.name,
      sortOrder: sortOrder.max + 1,
    });
    res.status(201).json(newPanel);
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { user, params } = req;
    const panel = await Panel.findOne({
      where: { userId: user.id, id: params.id },
    });
    if (panel) {
      return res.json(panel);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const bulkUpdate = async (req, res, next) => {
  try {
    const { user, body } = req;
    const statements = body.map(({ id }, index) => {
      return Panel.update(
        { sortOrder: index + 1 },
        { where: { userId: user.id, id } }
      );
    });
    const result = await Promise.all(statements);
    res.json(_.flatten(result));
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { user, params, body } = req;
    const [updatedRows] = await Panel.update(
      { name: body.name },
      { where: { userId: user.id, id: params.id } }
    );
    res.json({ updatedRows });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { user, params } = req;
    const deleted = await Panel.destroy({
      where: { userId: user.id, id: params.id },
    });
    res.json({ deleted });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  create,
  detail,
  bulkUpdate,
  update,
  remove,
};
