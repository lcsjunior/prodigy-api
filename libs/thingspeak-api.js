const axios = require('axios');
const _ = require('lodash');
const parseJSON = require('date-fns/parseJSON');

const instance = axios.create({
  baseURL: process.env.THINGSPEAK_API_URL,
});

const readChannelData = async (channels) => {
  if (channels.length === 0) return [];
  const promises = channels.map(({ channelId, readApiKey }) => {
    const promise = instance.get(`/channels/${channelId}/feeds.json`, {
      params: {
        api_key: readApiKey,
        results: 0,
      },
    });
    return promise;
  });
  const results = await Promise.allSettled(promises);
  const reduced = results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      return acc.concat(result.value?.data.channel);
    }
    return acc;
  }, []);
  return channels.map((channel) => {
    const chData = reduced.find((item) => item.id === channel.channelId);
    return {
      ...channel,
      chData,
    };
  });
};

const prepareEntryData = (obj = {}) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      if (key.substring(0, 5) === 'field') {
        obj[key] = _.toNumber(obj[key]);
      } else if (key === 'created_at') {
        obj[key] = Math.floor(parseJSON(obj[key]).getTime() / 1000);
      }
    }
  }
  return obj;
};

const readChannelLastEntry = async (channels) => {
  if (channels.length === 0) return [];
  const mappedChannels = await readChannelData(channels);
  const promises = mappedChannels.map(({ channelId, readApiKey }) => {
    const promise = instance.get(`/channels/${channelId}/feeds/last.json`, {
      params: {
        api_key: readApiKey,
        results: 0,
      },
      customProps: {
        channelId,
      },
    });
    return promise;
  });
  const results = await Promise.allSettled(promises);
  const reduced = results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      return acc.concat({
        ...result.value?.config.customProps,
        ...result.value?.data,
      });
    }
    return acc;
  }, []);
  return mappedChannels.map((channel) => {
    const lastEntry = prepareEntryData(
      reduced.find((item) => item.channelId === channel.channelId)
    );
    return {
      ...channel,
      lastEntry,
    };
  });
};

module.exports = {
  thingSpeakApi: instance,
  readChannelData,
  readChannelLastEntry,
};
