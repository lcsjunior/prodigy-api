const { Panel, Widget } = require('../models');

const list = async (req, res, next) => {
  try {
    const { user, query } = req;
    const widgets = await Widget.findAll({
      where: { panelId: query.panelId },
      include: [
        {
          model: Panel,
          attributes: [],
          where: { userId: user.id },
        },
      ],
    });
    res.json(widgets);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { query, body } = req;
    const newWidget = await Widget.create({
      panelId: query.panelId,
      typeId: body.typeId,
      chId: body.chId,
      fieldX: body.fieldX,
      displayName: body.displayName,
    });
    req.params['id'] = newWidget.id;
    res.status(201);
    next();
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { user, params } = req;
    const widget = await Widget.findOne({
      where: { id: params.id },
      include: [
        {
          model: Panel,
          attributes: [],
          where: { userId: user.id },
        },
      ],
    });
    if (widget) {
      return res.json(widget);
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
    await Widget.update(
      {
        chId: body.chId,
        fieldX: body.fieldX,
        displayName: body.displayName,
      },
      { where: { id: params.id } }
    );
    next();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { params } = req;
    const deleted = await Widget.destroy({
      where: { id: params.id },
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
  update,
  remove,
};
