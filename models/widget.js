'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Widget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Widget.belongsTo(models.Channel, {
        foreignKey: 'ch_id',
        allowNull: false,
      });
      Widget.belongsTo(models.WidgetType, {
        foreignKey: 'type_id',
        allowNull: false,
      });
      Widget.hasMany(models.WidgetField, {
        foreignKey: 'widget_id',
        as: 'fields',
      });
    }
  }
  Widget.init(
    {
      chId: { type: DataTypes.INTEGER, allowNull: false },
      typeId: { type: DataTypes.INTEGER, allowNull: false },
      displayName: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Widget',
      tableName: 'widget',
      underscored: true,
    }
  );
  return Widget;
};
