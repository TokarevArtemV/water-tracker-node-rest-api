import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import usersSchemas from "../schemas/userSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(usersSchemas.authSchema),
  usersControllers.register
);

userRouter.get("/verify/:verificationToken", usersControllers.verify);

userRouter.post(
  "/verify",
  validateBody(usersSchemas.userVerifyEmailSchema),
  usersControllers.verifyAgain
);

userRouter.post(
  "/login",
  validateBody(usersSchemas.authSchema),
  usersControllers.login
);

userRouter.get("/current", authenticate, usersControllers.getCurrent);

userRouter.post("/logout", authenticate, usersControllers.logout);

userRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatarURL"),
  usersControllers.updateAvatar
);

userRouter.put(
  "/update",
  authenticate,
  validateBody(usersSchemas.userDataUpdateSchema),
  usersControllers.updateUserData
);

userRouter.post(
  "/reset-password",
  validateBody(usersSchemas.userVerifyEmailSchema),
  usersControllers.verifyResetPasswordEmail
);

userRouter.patch(
  "/reset-password/:verificationToken",
  validateBody(usersSchemas.userPasswordSchema),
  usersControllers.resetPassword
);

userRouter.patch(
  "/waterRate",
  authenticate,
  validateBody(usersSchemas.userWaterRateSchema),
  usersControllers.waterRate
);

export default userRouter;
