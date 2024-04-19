import * as fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

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

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;

  const avatarPath = path.resolve("public", "avatars");

  const { path: oldPathAvatar, filename } = req.file;

  const newPathAvatar = path.join(avatarPath, filename);

  await fs.rename(oldPathAvatar, newPathAvatar);
  const avatarURL = path.join("avatars", filename);

  const user = await usersService.updateUser({ _id: id }, { avatarURL });

  res.status(200).json({
    avatarUrl: user.avatarURL,
  });
};

//---------------------------

const updateUserData = async (req, res, next) => {
  const { _id: id } = req.user;
  const { email, username, gender, currentPassword, newPassword } = req.body;

  // const user = req.user; // ?

  const user = await usersService.findUser({ id });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  let updatedUser;

  //-------- compare emails
  if (email) {
    const isUserAlreadyExist = await usersService.findUser({
      email,
    });
    if (isUserAlreadyExist) throw HttpError(404, "Email already exist");
  }

  //--------compare passwords
  if (currentPassword && newPassword) {
    if (password === newPassword) {
      throw HttpError(401, "The new password cannot be equal to the old one");
    }

    const comparePass = await usersService.validatePassword(
      currentPassword,
      user.password
    );
    if (!comparePass) throw HttpError(401, "Outdated password is wrong");

    await updatedUser.hashPassword();
    await updatedUser.save();

    await usersService.updateUser(
      { id },
      {
        email, //чи не можна перезаписати?
        username,
        gender,
        password: newPassword,
      },
      { new: true }
    );
  } else {
    updatedUser = await usersService.updateUser(
      { id },
      { email, username, gender },
      { new: true }
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
      newPassword, // забрати пілся тестування
    },
  });
};

// email, //чи не можна перезаписати?
// throw HttpError(401, "Password fields require");

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
