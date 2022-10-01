const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const permissions = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const permissionActions = require(path.join(__dirname, file));
    Object.assign(permissions, permissionActions);
  });

const checkPermission = (action) => {
  return (req, res, next) => {
    const hasPermission = permissions[action](req);
    if (hasPermission) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
};

module.exports = {
  checkPermission,
};
