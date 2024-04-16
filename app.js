import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import userRouter from "./routes/userRouter.js";
import "dotenv/config.js";
import waterPortionsRouter from "./routes/waterPortionsRouter.js";
import authenticate from "./middlewares/authenticate.js";

const { PORT = 3000, DB_HOST } = process.env;
const app = express();

app.use(morgan("tiny"));

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:5173",
    "https://water-tracker-pi.vercel.app",
    "https://water-tracker-node-rest-api.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", userRouter);

app.use(authenticate);

app.use("/api/water-portions", waterPortionsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

export default app;
