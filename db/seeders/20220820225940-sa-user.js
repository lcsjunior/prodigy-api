'use strict';
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  async up (queryInterface, Sequelize) {
    const saRoleId = await queryInterface.rawSelect('Roles', {
      where: {
        slug: 'sa',
      },
    }, ['id']);
    const hash = await bcrypt.hash(process.env.SA_PASS, saltRounds);
    return queryInterface.bulkInsert('Users', [
      {
        roleId: saRoleId,
        firstName: 'Super',
        lastName: 'Admin',
        email: 'sa@prodigyio.com',
        username: 'sa',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', {username: {[Op.eq]: 'sa'}}, {});
  }
};
