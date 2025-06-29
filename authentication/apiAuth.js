const { validateApiKey } = require('../src/services/api');
const { AppError } = require('../utils/error');

const APiAuthentication = async(req, _res, next) => { 
  try {
    let apiKeyfromHeader = req.headers['x-api-key'];
    if ( !apiKeyfromHeader) throw AppError('API key is required', 401);
    apiKeyfromHeader=apiKeyfromHeader.trim();

      if (typeof apiKeyfromHeader !== 'string' || apiKeyfromHeader.trim() === '') throw AppError('API key is required', 401);
     const apiKeyRegex = /^[a-f0-9]{48}$/;
     if( !apiKeyRegex.test(apiKeyfromHeader)) throw AppError('Invalid API key format', 401);

    const verifyApiKey = await validateApiKey(apiKeyfromHeader);
    if (!verifyApiKey) {
      throw AppError('Invalid or expired API key', 401)
    }
    req.currentApiKey = apiKeyfromHeader;
    next();

  } catch (error) {
      next(error)
  }
}

module.exports={
  APiAuthentication
}