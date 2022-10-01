const { AccessControl } = require('accesscontrol');

let grantsObject = {
  sa: {
    $extend: ['admin'],
  },
  admin: {
    $extend: ['user'],
    users: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  user: {
    users: {
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },
};

const ac = new AccessControl(grantsObject);

module.exports = {
  ac,
};
