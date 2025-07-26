const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const helmet = require('helmet');
const cors = require('cors');
app.use(express.static('public'));
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));
app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);
app.set("view engine", "ejs");

app.post("/api/v1",(req,res)=>{
  console.log(req.body);
  console.log("Req from client");
  console.log(req.cookies);
})

app.get("/api", (_req, res) => {

  res.status(200).json({ message: "Welcome to the MazaPay App API" , status: 200 });
});


app.disable('x-powerd-by');

app.get("/",(req,res)=>{
  res.status(200).json({
    message:"Welcome to maza secure pay"
  })
})


module.exports = {
  app,
};


