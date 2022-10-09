'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('widget_type', [
      {
        name: 'Display',
        slug: 'display',
        sort_order: 1,
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Gauge',
        slug: 'gauge',
        sort_order: 2,
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Time series',
        slug: 'series',
        sort_order: 3,
        is_input: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Input float',
        slug: 'inp_float',
        sort_order: 4,
        is_input: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Toggle switch',
        slug: 'switch',
        sort_order: 5,
        is_input: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('widget_type', null, {});
  }
};
