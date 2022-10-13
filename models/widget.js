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
      Widget.belongsTo(models.Panel, {
        foreignKey: 'panel_id',
        as: 'panel',
        allowNull: false,
      });
      Widget.belongsTo(models.WidgetType, {
        foreignKey: 'type_id',
        as: 'widget_type',
        allowNull: false,
      });
      Widget.belongsTo(models.WidgetType, {
        foreignKey: 'ch_id',
        as: 'channel',
        allowNull: false,
      });
    }
  }
  Widget.init(
    {
      panelId: { type: DataTypes.INTEGER, allowNull: false },
      typeId: { type: DataTypes.INTEGER, allowNull: false },
      chId: { type: DataTypes.INTEGER, allowNull: false },
      fieldX: { type: DataTypes.INTEGER, allowNull: false },
      displayName: DataTypes.STRING,
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
