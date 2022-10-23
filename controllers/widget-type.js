const { WidgetType } = require('../models');

const list = async (req, res, next) => {
  try {
    const widgets = await WidgetType.findAll();
    res.json(widgets);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
};
