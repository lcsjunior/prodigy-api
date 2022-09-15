const { AccessControl } = require('accesscontrol');

let grantsObject = {
  sa: {
    users: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  admin: {
    $extend: ['sa'],
  },
  user: {
    users: {
      'read:own': ['*'],
      'update:own': ['*'],
    },
  },
};

const ac = new AccessControl(grantsObject);

module.exports = {
  grantsObject,
  ac,
};
