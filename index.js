require("dotenv").config();
const { app } = require("./app");
const { mongoConnection } = require("./config");
const { sendTransactionEmail } = require("./lib/mail");
const router = require("./src/routes");
const {rateLimit}=require("express-rate-limit")
const PORT = process.env.PORT || 7071;


// rate limit for the users
const limit=rateLimit({
  windowMs: 1 * 60 * 1000, 
	limit: 100, 
})
app.use(limit)

app.use("/api", router);




app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to maza secure pay',
  });
});

// Routes



app.use((_req,res,_next)=>{
    res.status(400).json({
      message:"page not found",
      status:400
    })
})
app.use((err,_req,res,_next)=>{
    res.status(400).json({
      message:err?.message || "Something went wrong",
      status:err?.status || 500,
      hint:err?.hint || "Plese Contact support care"
    })
})


//  Database Connection & Server Start
mongoConnection(process.env.MONGO_URL, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

