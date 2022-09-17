function currentUser(req, res, next) {
  const {
    user: { username },
  } = req;
  return res.json({
    username,
  });
}

function login(req, res) {
  res.sendStatus(200);
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
}

module.exports = {
  currentUser,
  login,
  logout,
};
