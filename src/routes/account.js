const { Authentication } = require('../../authentication/authentication');
const {accountController} = require('../controllers');

const accountRoute = require('express').Router();

accountRoute.post('/new', accountController.createUser); //create new user
accountRoute.post('/access', accountController.accessUser); //access user
accountRoute.get('/customer/:id',Authentication, accountController.infoUser); //user information
accountRoute.patch('/customer/:id', Authentication,accountController.changePin); //change current pin
accountRoute.put('/customer/:id',Authentication, accountController.updateUser); //change information
accountRoute.post('/customer/:id', accountController.resetPin); //reset pin
accountRoute.post("/genarateapikey",Authentication,accountController.getnarateApiKey)
module.exports = accountRoute

