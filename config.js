// db.js
const mongoose = require('mongoose');

const mongoConnection = async (url = '', dbName = '') => {
  try {
    if (!url || !dbName) {
      throw new Error('MongoDB URL and dbName are required!');
    }

    await mongoose.connect(url, {
      dbName,
      connectTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB connected to [${dbName}]`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); 
  }
};

module.exports = { mongoConnection };
