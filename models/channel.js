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
        foreignKey: 'userId',
        as: 'user',
        allowNull: false,
      });
    }
  }
  Channel.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      channelId: { type: DataTypes.INTEGER, allowNull: false },
      readAPIKey: DataTypes.STRING,
      writeAPIKey: DataTypes.STRING,
      displayName: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Channel',
    }
  );
  return Channel;
};
