import express from "express";
import googleControllers from "../controllers/googleControllers.js";

const googleRouter = express.Router();

googleRouter.get("/google", googleControllers.googleAuth);

googleRouter.get("/google-redirect", googleControllers.googleRedirect);

export default googleRouter;