const { Channel, sequelize } = require('../models');

const psw = process.env.PGP_SYM_KEY;

async function list(req, res, next) {
  try {
    const { user } = req;
    const channels = await Channel.findAll({
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
      readAPIKey: sequelize.fn('pgp_sym_encrypt', body.readAPIKey, psw),
      writeAPIKey: sequelize.fn('pgp_sym_encrypt', body.writeAPIKey, psw),
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
        readAPIKey: sequelize.fn('pgp_sym_encrypt', body.readAPIKey, psw),
        writeAPIKey: sequelize.fn('pgp_sym_encrypt', body.writeAPIKey, psw),
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
