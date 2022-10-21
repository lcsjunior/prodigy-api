const { Op } = require('sequelize');
const { Channel, Widget, WidgetType, WidgetField } = require('../models');

const list = async (req, res, next) => {
  try {
    const { user, query } = req;
    const widgets = await Widget.findAll({
      where: { chId: query.chId },
      include: [
        {
          model: Channel,
          attributes: [],
          where: { userId: user.id },
        },
        {
          model: WidgetField,
          as: 'fields',
          attributes: ['fieldId'],
          require: true,
        },
        {
          model: WidgetType,
          as: 'type',
          attributes: ['slug'],
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
      typeId: body.typeId,
      chId: query.chId,
      displayName: body.displayName,
    });
    const fields = body.fields.map((i) => ({
      widgetId: newWidget.id,
      fieldId: i,
    }));
    await WidgetField.bulkCreate(fields);
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
          model: Channel,
          attributes: [],
          where: { userId: user.id },
        },
        {
          model: WidgetField,
          as: 'fields',
          attributes: ['fieldId'],
          require: true,
        },
        {
          model: WidgetType,
          as: 'type',
          attributes: ['slug'],
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
        displayName: body.displayName,
      },
      { where: { id: params.id } }
    );
    await WidgetField.destroy({
      where: {
        widgetId: params.id,
        fieldId: { [Op.notIn]: body.fields },
      },
    });
    const fields = body.fields.map((i) => ({
      widgetId: params.id,
      fieldId: i,
    }));
    await WidgetField.bulkCreate(fields, {
      ignoreDuplicates: true,
    });
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
