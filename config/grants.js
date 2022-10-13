const { AccessControl } = require('accesscontrol');

let grantsObject = {
  sa: {
    $extend: ['admin'],
  },
  admin: {
    $extend: ['user'],
    users: {
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  user: {
    users: {
      'create:any': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },
};

const ac = new AccessControl(grantsObject);

const checkPerm = (permission) => {
  return (req, res, next) => {
    const granted = permission(req);
    if (granted) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
};

module.exports = {
  ac,
  checkPerm,
};
