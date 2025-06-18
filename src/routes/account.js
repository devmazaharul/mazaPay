const {accountController} = require('../controllers');

const accountRoute = require('express').Router();

accountRoute.post('/new', accountController.accessUser); //create new user
accountRoute.post('/access', accountController.accessUser); //access user
accountRoute.get('/information', accountController.infoUser); //user information
accountRoute.patch('/changepin', accountController.changePin); //change current pin
accountRoute.put('/updateinfo', accountController.updateUser); //change information
accountRoute.put('/resetpin', accountController.resetPin); //reset pin

module.exports = accountRoute

