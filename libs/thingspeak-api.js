const axios = require('axios');
const _ = require('lodash');
const { parseISO } = require('date-fns');

const instance = axios.create({
  baseURL: process.env.THINGSPEAK_API_URL,
});

const prepareEntryData = (obj = {}) => {
  for (const key in obj) {
    if (key.substring(0, 5) === 'field') {
      obj[key] = _.toNumber(obj[key]);
    } else if (key === 'created_at') {
      obj[key] = Math.floor(parseISO(obj[key]).getTime() / 1000);
    }
  }
  return obj;
};

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
    const data = reduced.find((item) => item.id === channel.channelId);
    return {
      ...channel,
      data,
    };
  });
};

const readChannelFeeds = async (channels, params) => {
  if (channels.length === 0) return [];
  const promises = channels.map(({ channelId, readApiKey }) => {
    const promise = instance.get(`/channels/${channelId}/feeds.json`, {
      params: {
        ...params,
        api_key: readApiKey,
      },
    });
    return promise;
  });
  const results = await Promise.allSettled(promises);
  const reduced = results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      return acc.concat(result.value?.data);
    }
    return acc;
  }, []);
  return channels.map((channel) => {
    const data = reduced.find((item) => item.channel.id === channel.channelId);
    return {
      data: data?.channel,
      feeds: data?.feeds.map(prepareEntryData),
    };
  });
};

const readChannelLastEntry = async (channels) => {
  if (channels.length === 0) return [];
  const promises = channels.map(({ channelId, readApiKey }) => {
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
  return channels.map((channel) => {
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
  readChannelData,
  readChannelFeeds,
  readChannelLastEntry,
};
