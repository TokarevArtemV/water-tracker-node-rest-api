import * as fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import usersService from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmails.js";
import { verifyEmailLetter } from "../helpers/verifyEmailLetter.js";

const { JWT_SECRET, BASE_URL, SEND_MAIL_FROME, BASE_URL_CLIENT } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const isEmail = await usersService.findUser({ email });

  if (isEmail) throw HttpError(409, "Email in use");

  const avatarURL = gravatar.url(email, { r: "pg" }, true);

  const verificationToken = nanoid();

  const newUser = await usersService.register({
    ...req.body,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = verifyEmailLetter(email, verificationToken);

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    verify: newUser.verify,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await usersService.findUser({
    verificationToken,
  });

  if (!user) throw HttpError(404, "User not found");

  await usersService.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: null }
  );

  res.status(302).redirect(`${BASE_URL_CLIENT}/signin`);
};

const verifyAgain = async (req, res) => {
  const { email } = req.body;
  const user = await usersService.findUser({ email });

  if (!user) throw HttpError(404);

  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }

  const reverifyEmail = {
    to: [email, SEND_MAIL_FROME],
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(reverifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersService.findUser({ email });

  if (!user) throw HttpError(401, "Email or password invalid");

  if (!user.verify) throw HttpError(404, "Email not verified");

  const comparePass = await usersService.validatePassword(
    password,
    user.password
  );

  if (!comparePass) throw HttpError(401, "Email or password invalid");

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await usersService.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      username: user.username,
      gender: user.gender,
      avatarURL: user.avatarURL,
      waterRate: user.waterRate,
    },
  });
};

const getCurrent = async (req, res) => {
  const user = req.user;

  res.json({
    user: {
      email: user.email,
      username: user.username,
      gender: user.gender,
      avatarURL: user.avatarURL,
      waterRate: user.waterRate,
    },
  });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;

  await usersService.updateUser({ _id: id }, { token: "" });

  res.status(204).json();
};

//---------------------------updateAvatar
const updateAvatar = async (req, res) => {
  console.log(req.file.path, "1"); //+
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "No avatar");
  }
  console.log(req.file.path, "2"); //+

  const avatarURL = req.file.path;

  const user = await usersService.findUser({ _id });
  console.log(user);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await usersService.updateUser({ _id }, { avatarURL });

  // user.avatarURL = avatarURL;
  // user.save();

  res.status(200).json({
    avatarURL,
  });

  // const avatarPath = path.resolve("public", "avatars");
  // const { path: oldPathAvatar, filename } = req.file;
  // const newPathAvatar = path.join(avatarPath, filename);
  // await fs.rename(oldPathAvatar, newPathAvatar);

  // const avatarURL = path.join("avatars", filename);
  // const user = await usersService.updateUser({ _id }, { avatarURL });

  // res.status(200).json({
  //   avatarURL: user.avatarURL,
  // });
};

//---------------------------updateUserData
const updateUserData = async (req, res, _) => {
  const { _id } = req.user;
  const { email, username, gender, password, newPassword } = req.body;

  const user = await usersService.findUser({ _id });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  let updatedUser;

  if (email) {
    const isUserAlreadyExist = await usersService.findUser({
      email,
    });
    if (isUserAlreadyExist) throw HttpError(404, "Email already exist");
  }

  if (password && newPassword) {
    if (password === newPassword) {
      throw HttpError(401, "The new password cannot be equal to the old one");
    }
    const comparePass = await usersService.validatePassword(
      password,
      user.password
    );

    if (!comparePass) throw HttpError(401, "Outdated password is wrong");
    const hashPass = await bcrypt.hash(newPassword, 10);

    await usersService.updateUser(
      { _id },
      {
        email,
        username,
        gender,
        password: hashPass,
      }
    );
  } else {
    updatedUser = await usersService.updateUser(
      { _id },
      { email, username, gender }
    );
    if (!updatedUser) {
      throw HttpError(404);
    }
  }
  res.json({
    user: {
      email,
      username,
      gender,
    },
  });
};

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
  updateAvatar: controllerWrapper(updateAvatar),
  verify: controllerWrapper(verify),
  verifyAgain: controllerWrapper(verifyAgain),
  updateUserData: controllerWrapper(updateUserData),
};

// "email": "lolita@gmail.com",
// "currentPassword": "12345678",
// "newPassword": "123456789",
// "repeatPassword": "123456789"
