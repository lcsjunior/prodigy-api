const { Channel, sequelize } = require('../models');
const {
  readChannelData,
  readChannelLastEntry,
} = require('../libs/thingspeak-api');

const psw = process.env.PGP_SYM_KEY;

const list = async (req, res, next) => {
  try {
    const { user } = req;
    const channels = await Channel.findAll({
      raw: true,
      attributes: {
        include: [
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('read_api_key'), 'bytea'),
              psw
            ),
            'readApiKey',
          ],
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('write_api_key'), 'bytea'),
              psw
            ),
            'writeApiKey',
          ],
        ],
      },
      where: { userId: user.id },
      order: [['id', 'ASC']],
    });
    const data = await readChannelLastEntry(channels);
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
      readApiKey: sequelize.fn('pgp_sym_encrypt', body.readApiKey, psw),
      writeApiKey: sequelize.fn('pgp_sym_encrypt', body.writeApiKey, psw),
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
      attributes: {
        include: [
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('read_api_key'), 'bytea'),
              psw
            ),
            'readApiKey',
          ],
          [
            sequelize.fn(
              'pgp_sym_decrypt',
              sequelize.cast(sequelize.col('write_api_key'), 'bytea'),
              psw
            ),
            'writeApiKey',
          ],
        ],
      },
      where: { userId: user.id, id: params.id },
    });
    if (channel) {
      const data = await readChannelData([channel]);
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
    const { user, params, body } = req;
    await Channel.update(
      {
        readApiKey: sequelize.fn('pgp_sym_encrypt', body.readApiKey, psw),
        writeApiKey: sequelize.fn('pgp_sym_encrypt', body.writeApiKey, psw),
        displayName: body.displayName,
      },
      { where: { userId: user.id, id: params.id } }
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
