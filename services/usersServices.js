import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Water from "../models/Water.js";

const findUser = (filter) => User.findOne(filter);

const register = async (data) => {
  const hashPass = await bcrypt.hash(data.password, 10);

  return User.create({ ...data, password: hashPass });
};

const updateUser = async (filter, data) => User.findOneAndUpdate(filter, data);

const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

const deleteUsers = async (filter) => User.deleteMany(filter);

const waterRateDay = async (id, data) => User.findByIdAndUpdate(id, data);

const waterRateForTodayRecords = async (id, startOfDay, endOfDay, waterRate) =>
  Water.updateMany(
    { owner: id, createdAt: { $gte: startOfDay, $lt: endOfDay } },
    { $set: { dailyNorm: waterRate } }
  );

export default {
  register,
  findUser,
  updateUser,
  validatePassword,
  deleteUsers,
  waterRateDay,
  waterRateForTodayRecords,
};
