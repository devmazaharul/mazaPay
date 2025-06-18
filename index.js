require("dotenv").config();
const { app } = require("./app");
const { mongoConnection } = require("./config");
const router = require("./src/routes");

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api", router);

// // Database Connection & Server Start
// mongoConnection(process.env.MONGO_URL, process.env.DB_NAME)
//   .then(() => {
//     console.log("💻 [mongodb] : DB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ DB connection failed:", err.message);
//   });
  app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });