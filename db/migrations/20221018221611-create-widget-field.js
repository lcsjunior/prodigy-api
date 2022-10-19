'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('widget_field', {
      widget_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: {
            tableName: 'widget',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      field_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
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
    await queryInterface.dropTable('widget_field');
  },
};
