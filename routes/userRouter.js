import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import usersSchemas from "../schemas/userSchemas.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import resizeFile from "../middlewares/resizeFile.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateBody(usersSchemas.userRegisterSchema),
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
  validateBody(usersSchemas.userLoginSchema),
  usersControllers.signin
);

userRouter.patch(
  "/subscription",
  authenticate,
  validateBody(usersSchemas.userUpdateSubscriptionSchema),
  usersControllers.updateSubscription
);

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarUrl"),
  resizeFile,
  usersControllers.updateAvatar
);

userRouter.post("/current", authenticate, usersControllers.getCurrent);

userRouter.post("/logout", authenticate, usersControllers.signout);

export default userRouter;
