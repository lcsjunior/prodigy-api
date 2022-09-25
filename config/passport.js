const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User, Role, Sequelize } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id, {
    include: [{ model: Role, as: 'roles', required: true, attributes: [] }],
    attributes: [
      'id',
      'username',
      'firstName',
      'lastName',
      [Sequelize.literal('"roles"."slug"'), 'role'],
    ],
  });
  if (user.id === id) {
    done(null, user.toJSON());
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const match = await user.isValidPassword(password);
      if (match) {
        return done(null, user);
      }
    }
    return done(null, false);
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

module.exports = {
  passport,
  isAuthenticated,
};
