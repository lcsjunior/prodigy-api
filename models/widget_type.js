'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WidgetType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WidgetType.hasMany(models.Widget, {
        foreignKey: 'type_id',
      });
    }
  }
  WidgetType.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortOrder: DataTypes.INTEGER,
      isInput: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'WidgetType',
      tableName: 'widget_type',
      underscored: true,
    }
  );
  return WidgetType;
};
