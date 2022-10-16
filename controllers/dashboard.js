const { Panel, Widget, Channel, WidgetType } = require('../models');
const _ = require('lodash');
const { readChannelLastEntry } = require('../libs/thingspeak-api');

const detail = async (req, res, next) => {
  try {
    const { user, params } = req;
    const panel = await Panel.findOne({
      attributes: ['id', 'name'],
      include: [
        {
          model: Widget,
          as: 'widgets',
          attributes: ['id', 'fieldX', 'displayName'],
          include: [
            {
              model: Channel,
              as: 'channel',
              required: true,
              attributes: ['id', 'channelId', 'readApiKey'],
            },
            {
              model: WidgetType,
              as: 'type',
              required: true,
              attributes: ['slug'],
            },
          ],
        },
      ],
      where: { userId: user.id, id: params.id },
    });
    if (panel) {
      const channels = _.uniqBy(
        panel.widgets.map(
          ({ channel }) => ({
            channelId: channel.channelId,
            readApiKey: channel.readApiKey,
          }),
          ['channelId', 'readApiKey']
        )
      );
      const result = await readChannelLastEntry(channels);
      const serialized = panel.toJSON();
      const widgets = serialized.widgets.map((widget) => {
        const foundChannel = result.find(
          (item) => item.channelId === widget.channel.channelId
        );
        return {
          id: widget.id,
          type: widget.type,
          name:
            widget.displayName || foundChannel?.chData[`field${widget.fieldX}`],
          lastValue: foundChannel?.lastEntry[`field${widget.fieldX}`],
          lastUpdated: foundChannel?.lastEntry.created_at,
        };
      });
      return res.json({
        ...serialized,
        widgets,
      });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  detail,
};
