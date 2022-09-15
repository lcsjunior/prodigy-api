'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'SA',
        slug: 'sa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin',
        slug: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User',
        slug: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
