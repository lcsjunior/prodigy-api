const { Channel, sequelize } = require('../models');
const { readDataFromChannel } = require('../libs/thingspeak-api');

const psw = process.env.PGP_SYM_KEY;

const list = async (req, res, next) => {
  try {
    const { user } = req;
    const channels = await Channel.findAll({
      raw: true,
      nest: true,
      attributes: {
        include: [
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('readAPIKey'), 'bytea'),
              psw
            ),
            'readAPIKey',
          ],
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('writeAPIKey'), 'bytea'),
              psw
            ),
            'writeAPIKey',
          ],
        ],
      },
      where: { userId: user.id },
      order: [['id', 'ASC']],
    });
    const data = await readDataFromChannel(channels);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { user, body } = req;
    const newChannel = await Channel.create({
      userId: user.id,
      channelId: body.channelId,
      readAPIKey: sequelize.fn('pgp_sym_encrypt', body.readAPIKey, psw),
      writeAPIKey: sequelize.fn('pgp_sym_encrypt', body.writeAPIKey, psw),
      displayName: body.displayName,
    });
    req.params['id'] = newChannel.id;
    res.status(201);
    next();
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const { user, params } = req;
    const channel = await Channel.findOne({
      raw: true,
      nest: true,
      attributes: {
        include: [
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('readAPIKey'), 'bytea'),
              psw
            ),
            'readAPIKey',
          ],
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('writeAPIKey'), 'bytea'),
              psw
            ),
            'writeAPIKey',
          ],
        ],
      },
      where: { userId: user.id, id: params.id },
    });
    if (channel) {
      const data = await readDataFromChannel([channel]);
      res.json(data[0]);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { user, body, params } = req;
    await Channel.update(
      {
        readAPIKey: sequelize.fn('pgp_sym_encrypt', body.readAPIKey, psw),
        writeAPIKey: sequelize.fn('pgp_sym_encrypt', body.writeAPIKey, psw),
        displayName: body.displayName,
      },
      {
        where: { userId: user.id, id: params.id },
      }
    );
    next();
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { user, params } = req;
    const deleted = await Channel.destroy({
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
  update,
  remove,
};
