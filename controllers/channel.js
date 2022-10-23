const { Channel, sequelize } = require('../models');
const {
  readChannelData,
  readChannelFeeds,
  readChannelLastEntry,
} = require('../libs/thingspeak-api');
const _ = require('lodash');
const { isDev } = require('../utils/current-env');

const psw = process.env.PGP_SYM_KEY;

const readApiKeyField = [
  sequelize.fn(
    'pgp_sym_decrypt',
    sequelize.cast(sequelize.col('read_api_key'), 'bytea'),
    psw
  ),
  'readApiKey',
];

const writeApiKeyField = [
  sequelize.fn(
    'pgp_sym_decrypt',
    sequelize.cast(sequelize.col('write_api_key'), 'bytea'),
    psw
  ),
  'writeApiKey',
];

const checkFieldNumber = async (value) => {
  if (value.length === 0 || value.find((val) => val < 1 || val > 8)) {
    return Promise.reject();
  }
};

const isOwnerChannel = async (req, res, next) => {
  const { user, query } = req;
  const channel = await Channel.findOne({
    raw: true,
    attributes: ['id', 'userId'],
    where: { id: query.chId, userId: user.id },
  });
  if (channel) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const list = async (req, res, next) => {
  try {
    const { user } = req;
    const channels = await Channel.findAll({
      raw: true,
      attributes: {
        include: [readApiKeyField, writeApiKeyField],
      },
      where: { userId: user.id },
      order: [['sortOrder', 'ASC']],
    });
    const data = await readChannelData(channels);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { user, body } = req;
    const sortOrder = await Channel.findOne({
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
    const newChannel = await Channel.create({
      userId: user.id,
      channelId: body.channelId,
      readApiKey: sequelize.fn('pgp_sym_encrypt', body.readApiKey, psw),
      writeApiKey: sequelize.fn('pgp_sym_encrypt', body.writeApiKey, psw),
      displayName: body.displayName,
      sortOrder: sortOrder.max + 1,
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
      attributes: {
        include: [readApiKeyField, writeApiKeyField],
      },
      where: { userId: user.id, id: params.id },
    });
    if (channel) {
      const serialized = channel.toJSON();
      const data = await readChannelData([serialized]);
      res.json(data[0]);
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
      return Channel.update(
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

const readFeeds = async (req, res, next) => {
  try {
    const { user, params, query } = req;
    const channel = await Channel.findOne({
      raw: true,
      attributes: ['channelId', readApiKeyField],
      where: { userId: user.id, id: params.id },
    });
    const result = await readChannelFeeds([channel], {
      results: query.results,
      timescale: query.timescale,
      round: query.round,
      days: 30,
    });
    res.json(result[0].feeds || []);
  } catch (err) {
    next(err);
  }
};

const eventsHandler = (req, res, next) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  res.writeHead(200, headers);

  const { user, params } = req;

  const feedData = async () => {
    let channel;
    if (!channel) {
      channel = await Channel.findOne({
        raw: true,
        attributes: ['channelId', readApiKeyField],
        where: { userId: user.id, id: params.id },
      });
    }
    if (channel) {
      const result = await readChannelLastEntry([channel]);
      const lastEntry = result[0].lastEntry;
      const strJson = JSON.stringify(lastEntry);
      const data = `data: ${strJson}\n\n`;
      res.write(data);
      if (isDev) {
        console.log(`Feed: ${strJson}`);
      }
    }
  };
  const intervalId = setInterval(feedData, 5000);

  req.on('close', () => {
    clearInterval(intervalId);
    console.log('Connection closed');
  });
};

module.exports = {
  checkFieldNumber,
  isOwnerChannel,
  list,
  create,
  detail,
  bulkUpdate,
  update,
  remove,
  readFeeds,
  eventsHandler,
};
