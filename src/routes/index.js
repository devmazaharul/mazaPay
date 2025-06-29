const  accountRoute  = require("./account");
const  apiRoute  = require("./api");
const  payRoute = require("./pay");
const app=require("express").Router()


app.use(accountRoute)
app.use(apiRoute)
app.use("/pay",payRoute)

module.exports=app