'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'SA',
        slug: 'sa',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Admin',
        slug: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'User',
        slug: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
