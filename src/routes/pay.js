const payRoute=require("express").Router()
const { Authentication } = require("../../authentication/authentication");
const { Authorization } = require("../../authentication/authorization");
const {payController} =require("../controllers/index");
const { getTransactions } = require("../controllers/pay");

payRoute.post("/send",Authentication,payController.senMoney) //send money another user (done)
payRoute.get("/transactions",Authentication,payController.transaction) //transaction transaction (done)
payRoute.get("/transactions/:trxId",Authentication,payController.singletransaction) //transaction transaction by id (done)

payRoute.post("/payment",payController.paymentMoney)
payRoute.post("/cashout",payController.cashoutMoney)

payRoute.get("/realtimetransactions",Authentication,Authorization(["user","admin"]),getTransactions)

module.exports=payRoute
