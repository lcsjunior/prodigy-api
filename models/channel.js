'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Channel.belongsTo(models.User, {
        foreignKey: 'user_id',
        allowNull: false,
      });
      Channel.hasMany(models.Widget, { foreignKey: 'ch_id', as: 'widgets' });
    }
  }
  Channel.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      channelId: { type: DataTypes.INTEGER, allowNull: false },
      readApiKey: DataTypes.STRING,
      writeApiKey: DataTypes.STRING,
      displayName: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Channel',
      tableName: 'channel',
      underscored: true,
    }
  );
  return Channel;
};
