const { ApiKeyModel } = require('../models/apikey');

const validateApiKey = async (apiKey) => {
  //check if the API key exists in the database
  const findApiKey = await ApiKeyModel.findOne({ key: apiKey });

  if (!findApiKey) {
    return false;
  }
  //check if the API key is active
  if (!findApiKey.isActive) {
    return false;
  }
  //check if the API key has expired
  const currentDate = new Date();
  if (findApiKey.expiresAt < currentDate) {
    return false;
  }
  return true;
};







module.exports = {
  validateApiKey,
};
