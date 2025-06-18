const mongoose = require('mongoose');

const mongoConnection = (url = '', dbName = '') => {
  return mongoose.connect(url, { dbName });
};
module.exports = {
  mongoConnection,
};
