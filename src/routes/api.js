const { APiAuthentication } = require('../../authentication/apiAuth');
const { apiController } = require('../controllers');

const apiRoute = require('express').Router();

apiRoute.post('/payment/create',APiAuthentication,apiController.paymentInit);
apiRoute.get('/payment/:paymentid',apiController.getPayInfowithID);
apiRoute.post("/payment/confirm-payment",apiController.confirmPayment)
apiRoute.post('/payment', APiAuthentication,apiController.paymentAction);
apiRoute.post('/success', apiController.successStatus);
apiRoute.post('/faield', apiController.faieldStatus);
apiRoute.post('/cancel', apiController.faieldStatus);


module.exports = apiRoute;
