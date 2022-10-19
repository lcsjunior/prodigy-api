'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('widget_type', [
      {
        name: 'Time series',
        slug: 'series',
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
