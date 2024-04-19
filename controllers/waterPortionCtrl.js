import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";
import HttpError from "../helpers/HttpError.js";
import { addHours, format } from "date-fns";
import Water from "../models/Water.js";

const addWaterPortion = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await waterPortionServices.addWaterPortion({
    ...req.body,
    owner,
  });
  res.status(201).json({
    id: result._id,
    portion: result.waterVolume,
    date: result.date,
  });
};

const updateWaterPortion = async (req, res) => {
  const { id } = req.params;
  const result = await waterPortionServices.updateWaterPortion(id, req.body);
  if (!result) throw HttpError(404);
  res.json(result);
};

const deleteWaterPortion = async (req, res) => {
  const { id } = req.params;
  const result = await waterPortionServices.deleteWaterPortion(id);
  if (!result) throw HttpError(404);
  res.json(result);
};

const todayWaterPortion = async (req, res) => {
  const { _id: owner } = req.user;

  const utcDate = new Date().toUTCString();
  const startOfDay = new Date(utcDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(utcDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const foundWaterDayData = await Water.find({
    owner,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).select(`-createdAt -updatedAt`);

  if (foundWaterDayData.length === 0) {
    throw HttpError(404, "No notes yet");
  } else {
    const totalWater = foundWaterDayData.reduce(
      (total, { waterVolume }) => total + waterVolume,
      0
    );
    const interestWater = (totalWater / 2000) * 100;

    res.json({ ...foundWaterDayData, interest: interestWater });
  }
};

export default {
  addWaterPortion: ctrlWrapper(addWaterPortion),
  updateWaterPortion: ctrlWrapper(updateWaterPortion),
  deleteWaterPortion: ctrlWrapper(deleteWaterPortion),
  todayWaterPortion: ctrlWrapper(todayWaterPortion),
};
