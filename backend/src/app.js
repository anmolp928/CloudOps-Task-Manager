const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "CloudOps Task Manager API Running",
  });
});


// Auth Routes
app.use("/api/auth", authRoutes);


module.exports = app;