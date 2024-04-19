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

userRouter.get("/current", authenticate, usersControllers.getCurrent);

userRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatarURL"),
  resizeFile,
  usersControllers.updateAvatar
);

userRouter.put(
  "/update",

  authenticate,
  (req, res, next) => {
    console.log(req.headers);
    next();
  },
  validateBody(usersSchemas.userDataUpdateSchema),
  usersControllers.updateUserData
);

userRouter.post("/logout", authenticate, usersControllers.logout);

export default userRouter;
