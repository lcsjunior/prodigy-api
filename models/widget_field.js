'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WidgetField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WidgetField.belongsTo(models.Widget, {
        foreignKey: 'widget_id',
        allowNull: false,
      });
    }
  }
  WidgetField.init(
    {
      widgetId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      fieldId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    },
    {
      sequelize,
      modelName: 'WidgetField',
      tableName: 'widget_field',
      underscored: true,
    }
  );
  return WidgetField;
};
