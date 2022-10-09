'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Panel.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'users',
        allowNull: false,
      });
      Panel.hasMany(models.Widget, { foreignKey: 'panel_id', as: 'widget' });
    }
  }
  Panel.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Panel',
      tableName: 'panel',
      underscored: true,
    }
  );
  return Panel;
};
