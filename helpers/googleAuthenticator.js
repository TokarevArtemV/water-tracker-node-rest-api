import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { verifyEmailLetter } from "./verifyEmailLetter.js";

const { JWT_SECRET } = process.env;

const googleAuthenticator = async (data) => {

  console.log('🌷  data:', data)
  
  const { email, given_name, picture } = data;

  let user;

  // Перевіряємо, чи існує користувач з такою електронною адресою
  user = await User.findOne({ email });

  if (user) {
    // Якщо користувач існує, генеруємо токен і оновлюємо його в базі даних
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    return token;
  }

  // Якщо користувач не існує, створюємо нового
  const verificationToken = nanoid();
  const hashPass = await bcrypt.hash(nanoid(), 10); // Генеруємо тимчасовий пароль
  const newUser = await User.create({
    email,
    password: hashPass,
    username: given_name,
    avatarURL: picture,
    verificationToken,
  });

  // Генеруємо токен для нового користувача і оновлюємо його в базі даних
  const payload = { id: newUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(newUser._id, { token });

  // Відправляємо лист для підтвердження електронної пошти
  const verifyEmail = verifyEmailLetter(email, verificationToken);
  await sendEmail(verifyEmail);

  return token; //! Можливо також виконати перенаправлення для входу 
};

export default googleAuthenticator;

