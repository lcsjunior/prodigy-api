'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('widget', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      panel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'panel',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'widget_type',
            schema: 'public',
          },
          key: 'id',
        },
        allowNull: false,
      },
      ch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'channel',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      field_x: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      display_name: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('widget');
  },
};
