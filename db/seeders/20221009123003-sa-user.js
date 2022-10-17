'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  async up(queryInterface, Sequelize) {
    const saRoleId = await queryInterface.rawSelect(
      'roles',
      {
        where: {
          slug: 'sa',
        },
      },
      ['id']
    );
    const hash = await bcrypt.hash(process.env.SA_PASS, saltRounds);
    return queryInterface.bulkInsert('users', [
      {
        role_id: saRoleId,
        first_name: 'Super',
        last_name: 'Admin',
        email: 'sa@prodigyio.com',
        username: 'sa',
        password: hash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      'users',
      { username: { [Op.eq]: 'sa' } },
      {}
    );
  },
};
