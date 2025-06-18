const { apiController } = require('../controllers');

const apiRoute = require('express').Router();

apiRoute.post('/init', apiController.paymentInit);
apiRoute.post('/paymentaction', apiController.paymentAction);
apiRoute.post('/success', apiController.successStatus);
apiRoute.post('/faield', apiController.faieldStatus);

module.exports = apiRoute;
