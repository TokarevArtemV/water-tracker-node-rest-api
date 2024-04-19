import express from "express";
import validateBody from "../helpers/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import {
  createWaterPortionSchema,
  updateWaterPortionSchema,
} from "../schemas/waterPortionSchemas.js";
import waterPortionCtrl from "../controllers/waterPortionCtrl.js";

const waterPortionsRouter = express.Router();

waterPortionsRouter.post(
  "/",
  validateBody(createWaterPortionSchema),
  waterPortionCtrl.addWaterPortion
);

waterPortionsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateWaterPortionSchema),
  waterPortionCtrl.updateWaterPortion
);

waterPortionsRouter.delete(
  "/:id",
  isValidId,
  waterPortionCtrl.deleteWaterPortion
);

waterPortionsRouter.get("/today", waterPortionCtrl.todayWaterPortion);

export default waterPortionsRouter;
