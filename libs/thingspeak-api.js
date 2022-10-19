const axios = require('axios');
const _ = require('lodash');
const { parseISO } = require('date-fns');

const instance = axios.create({
  baseURL: process.env.THINGSPEAK_API_URL,
});

const prepareEntryData = (obj = {}) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      if (key.substring(0, 5) === 'field') {
        obj[key] = _.toNumber(obj[key]);
      } else if (key === 'created_at') {
        obj[key] = parseISO(obj[key]).getTime();
      }
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
    const chData = reduced.find((item) => item.id === channel.channelId);
    return {
      ...channel,
      chData,
    };
  });
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

const readChannelFeeds = async (channels) => {
  if (channels.length === 0) return [];
  const mappedChannels = await readChannelData(channels);
  const promises = mappedChannels.map(({ channelId, readApiKey }) => {
    const promise = instance.get(`/channels/${channelId}/feeds.json`, {
      params: {
        api_key: readApiKey,
        results: 4000,
        // timescale: 10,
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
  return mappedChannels.map((channel) => {
    const chData = reduced.find(
      (item) => item.channel.id === channel.channelId
    );
    return {
      ...channel,
      chData: chData?.channel,
      feeds: chData?.feeds.map(prepareEntryData),
    };
  });
};

module.exports = {
  thingSpeakApi: instance,
  readChannelData,
  readChannelLastEntry,
  readChannelFeeds,
};
