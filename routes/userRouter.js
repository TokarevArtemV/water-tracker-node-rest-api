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

userRouter.post(
  "/current",
  authenticate,
  validateBody(usersSchemas.userTokenSchema),
  usersControllers.getCurrent
);

userRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatarURL"),
  resizeFile,
  usersControllers.updateAvatar
);

userRouter.post("/current", authenticate, usersControllers.getCurrent);

userRouter.post("/logout", authenticate, usersControllers.logout);

export default userRouter;
