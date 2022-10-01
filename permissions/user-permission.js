const { ac } = require('../config/grants');

const readAnyUser = ({ user }) => {
  const permission = ac.can(user.role).readAny('users');
  return permission.granted;
};

const readOwnUser = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).readOwn('users')
      : ac.can(user.role).readAny('users');
  return permission.granted;
};

const updateOwnUser = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).updateOwn('users')
      : ac.can(user.role).updateAny('users');
  return permission.granted;
};

const deleteOwnUser = ({ user, params }) => {
  const permission =
    user.id == params.id
      ? ac.can(user.role).deleteOwn('users')
      : ac.can(user.role).deleteAny('users');
  return permission.granted;
};

module.exports = {
  readAnyUser,
  readOwnUser,
  updateOwnUser,
  deleteOwnUser,
};
