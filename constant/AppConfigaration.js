module.exports = Object.freeze({
  APP_NAME: "Banking App",
  APP_VERSION: "1.0.0",
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mazapay",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10) || 10,
  API_BASE_URL: process.env.API_BASE_URL || "/api/v1",
  MINIMUM_TRANSACTION_AMOUNT:10,

})