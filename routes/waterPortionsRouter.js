import express from "express";
import validateBody from "../helpers/validateBody.js";
import { createWaterPortionSchema } from "../schemas/waterPortionSchemas.js";
import waterPortionCtrl from "../controllers/waterPortionCtrl.js";

const waterPortionsRouter = express.Router();

waterPortionsRouter.post(
    "/",
    validateBody(createWaterPortionSchema),
    waterPortionCtrl.addWaterPortion
);

export default waterPortionsRouter;
