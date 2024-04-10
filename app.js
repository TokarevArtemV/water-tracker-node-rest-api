import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config.js";

const { PORT = 3000, DB_HOST } = process.env;
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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
      console.log("Server is running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

export default app;
