import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authenticate from "./middlewares/authenticate.js";
import userRouter from "./routes/userRouter.js";
import googleRouter from "./routes/googleRouter.js";
import waterPortionsRouter from "./routes/waterPortionsRouter.js";
import "dotenv/config.js";
import swaggerDocument from "./swagger.json" assert { type: "json" };


const { PORT = 3000, DB_HOST } = process.env;
const app = express();

app.use(morgan("tiny"));

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", userRouter);

app.use("/api/auth", googleRouter);

app.use("/api/water-portions", authenticate, waterPortionsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
