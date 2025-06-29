const payRoute=require("express").Router()
const { Authentication } = require("../../authentication/authentication");
const {payController} =require("../controllers/index");

payRoute.post("/send",Authentication,payController.senMoney) //send money another user (done)
payRoute.get("/transactions",Authentication,payController.transaction) //transaction transaction (done)
payRoute.get("/transactions/:trxId",Authentication,payController.singletransaction) //transaction transaction by id (done)

payRoute.post("/payment",payController.paymentMoney)
payRoute.post("/cashout",payController.cashoutMoney)

module.exports=payRoute
