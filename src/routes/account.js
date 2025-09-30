const { Authentication } = require('../../authentication/authentication');
const { accountController } = require('../controllers');
const accountRoute = require('express').Router();

/**
 * ================================
 * 🔑 Authentication Routes
 * ================================
 */
accountRoute.post('/new', accountController.createUser);        // Create new user
accountRoute.post('/access', accountController.accessUser);     // Login / access user
accountRoute.post('/logout', Authentication, accountController.logout); // Logout
accountRoute.get('/me', Authentication, accountController.meController); // Current user info

/**
 * ================================
 * 👤 Customer Routes
 * ================================
 */
accountRoute
  .route('/customer/:id')
  .get(Authentication, accountController.infoUser)        // User info
  .patch(Authentication, accountController.changePin)     // Change PIN
  .put(Authentication, accountController.updateUser)      // Update info
  .post(accountController.resetPin);                      // Reset PIN

/**
 * ================================
 * 🔐 API Key Routes
 * ================================
 */
accountRoute.post('/generateapikey', Authentication, accountController.getnarateApiKey); // Generate API key
accountRoute.get('/apikeys/me', Authentication, accountController.meapikeyinfocontroller);  // Get my API keys info
accountRoute.delete('/apikeys/:apikeyid', Authentication, accountController.deleteApikey);  // Delete API key

module.exports = accountRoute;
