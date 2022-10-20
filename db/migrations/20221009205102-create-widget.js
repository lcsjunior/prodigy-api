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
      display_name: {
        type: Sequelize.STRING,
      },
      sort_order: {
        type: Sequelize.INTEGER,
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
