require("dotenv").config();
const { app } = require("./app");
const { mongoConnection } = require("./config");
const router = require("./src/routes");

const PORT = process.env.PORT || 3000;


// Routes
app.use("/api", router);


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
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

