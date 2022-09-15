const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { passport } = require('./config/passport');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize, Sequelize } = require('./models');
const sessionStore = new SequelizeStore({ db: sequelize });

// app routing
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 604800000, // One week in ms
    },
    store: sessionStore,
  })
);
sessionStore.sync();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError && err.errors) {
    const errors = err.errors.map((e) => {
      const { message, path } = e;
      return req.app.get('env') === 'development'
        ? err.errors
        : { message, path };
    });
    return res.status(400).send(errors);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
