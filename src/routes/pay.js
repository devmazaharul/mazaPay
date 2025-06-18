const payRoute=require("express").Router()
const {payController} =require("../controllers/index");

payRoute.post("/send",payController.senMoney)
payRoute.post("/details",payController.detailsTransaction)
payRoute.post("/payment",payController.paymentMoney)
payRoute.post("/cashout",payController.cashoutMoney)

module.exports=payRoute
