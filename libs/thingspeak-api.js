const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.THINGSPEAK_API_URL,
});

const readDataFromChannel = async (channels) => {
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

module.exports = {
  thingSpeakApi: instance,
  readDataFromChannel,
};
