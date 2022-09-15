const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

const mongoStore = MongoStore.create({ mongoUrl: process.env.MONGO_URL });

module.exports = {
  mongoose,
  mongoStore,
};
