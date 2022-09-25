const { Channel } = require('../models');

async function list(req, res, next) {
  try {
    const { user } = req;
    const channels = await Channel.findAll({
      where: { userId: user.id },
    });
    res.json(channels);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { user, body } = req;
    const newChannel = await Channel.create({
      userId: user.id,
      channelId: body.channelId,
      readAPIKey: body.readAPIKey,
      writeAPIKey: body.writeAPIKey,
    });
    res.json(newChannel);
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const { user, params } = req;
    const channel = await Channel.findOne({
      where: { userId: user.id, id: params.id },
    });
    res.json(channel);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { user, body, params } = req;
    const [updatedRows] = await Channel.update(
      {
        readAPIKey: body.readAPIKey,
        writeAPIKey: body.writeAPIKey,
      },
      { where: { userId: user.id, id: params.id } }
    );
    res.json({ updatedRows });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { user, params } = req;
    const deleted = await Channel.destroy({
      where: { userId: user.id, id: params.id },
    });
    res.json({ deleted });
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
