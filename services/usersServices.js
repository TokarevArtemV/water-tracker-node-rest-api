import bcrypt from "bcrypt";

import User from "../models/User.js";

const findUser = (filter) => User.findOne(filter);

const register = async (data) => {
  const hashPass = await bcrypt.hash(data.password, 10);

  return User.create({ ...data, password: hashPass });
};

const updateUser = async (filter, data) => User.findOneAndUpdate(filter, data);

const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

const deleteUsers = async (filter) => User.deleteMany(filter);

export default {
  register,
  findUser,
  updateUser,
  validatePassword,
  deleteUsers,
};
