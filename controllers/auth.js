const detailUser = (req, res, next) => {
  const {
    user: { username, firstName, lastName },
  } = req;
  return res.json({
    username,
    firstName,
    lastName,
  });
};

const login = (req, res) => {
  res.sendStatus(200);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};

module.exports = {
  detailUser,
  login,
  logout,
};
