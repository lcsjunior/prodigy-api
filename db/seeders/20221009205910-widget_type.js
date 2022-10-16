'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('widget_type', [
      {
        name: 'Display',
        slug: 'display',
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Gauge',
        slug: 'gauge',
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Time series',
        slug: 'series',
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Input float',
        slug: 'in_float',
        is_input: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Toggle switch',
        slug: 'switch',
        is_input: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    return queryInterface.bulkUpdate('widget_type', {
      sort_order: Sequelize.literal('id'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('widget_type', null, {});
  },
};
