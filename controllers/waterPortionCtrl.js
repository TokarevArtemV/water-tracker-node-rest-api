import { format } from "date-fns";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";
import HttpError from "../helpers/HttpError.js";
import Water from "../models/Water.js";

const addWaterPortion = async (req, res) => {
  const { _id: owner, waterRate: dailyNorm } = req.user;
  const result = await waterPortionServices.addWaterPortion({
    ...req.body,
    owner,
    dailyNorm,
  });
  res.status(201).json({
    _id: result._id,
    waterVolume: result.waterVolume,
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
  const { _id: owner, waterRate } = req.user;
  const { timezone, timeday } = req.headers;

  const timeZoneFromHeader = new Date().getTimezoneOffset(timezone);
  let utcDate = new Date();
  let currentDay;

  if (Number(timeday) === 1) {
    currentDay = new Date(utcDate.getTime() - 24 * 60 * 60 * 1000);
  } else {
    currentDay = new Date(utcDate.setDate(Number(timeday)));
  }

  const timeZoneOffset = -(-180) * 60 * 1000;

  const startOfDay = new Date(
    currentDay.setUTCHours(0, 0, 0, 0) - timeZoneOffset
  );
  const endOfDay = new Date(
    currentDay.setUTCHours(23, 59, 59, 999) - timeZoneOffset
  );
  console.log(timezone, timeday, timeZoneFromHeader);
  console.log(startOfDay, endOfDay);
  const foundWaterDayData = await waterPortionServices.getWaterDayData({
    owner,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  if (foundWaterDayData.length === 0) {
    res.json({ data: [], interest: 0 });
  } else {
    const totalWater = foundWaterDayData.reduce(
      (total, { waterVolume }) => total + waterVolume,
      0
    );

    const interestWater = (totalWater / waterRate) * 100;

    res.json({ data: foundWaterDayData, interest: interestWater });
  }
};

const monthlyWaterPortion = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.query;

  const currentDate = new Date(date);
  const startOfMonth = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      1,
      0,
      0,
      0,
      0
    )
  );
  const endOfMonth = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + 1,
      1,
      0,
      0,
      0,
      0
    )
  );
  endOfMonth.setUTCMilliseconds(-1);

  const foundWaterMonthData = await Water.find({
    owner,
    date: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  }).select(`-createdAt -updatedAt`);

  const lastDay = endOfMonth.getUTCDate();

  let monthlyData = [];

  for (let day = 2; day <= lastDay + 1; day++) {
    const recordDate = new Date(
      Date.UTC(startOfMonth.getFullYear(), startOfMonth.getMonth(), day)
    );
    const filteredData = foundWaterMonthData.filter(
      (record) =>
        new Date(record.date).toISOString().split("T")[0] ===
        recordDate.toISOString().split("T")[0]
    );
    if (filteredData.length === 0) {
      continue;
    }
    const waterSum = filteredData.reduce(
      (acc, record) => acc + Number(record.waterVolume),
      0
    );

    const dailyNorm = filteredData[filteredData.length - 1].dailyNorm;
    const dailyData = {
      date: format(recordDate, "d, MMMM"),
      percent: `${Math.round((waterSum / dailyNorm) * 100)}%`,
      quantity: filteredData.length,
      dailyNorm: `${dailyNorm / 1000}L`,
    };
    monthlyData.push(dailyData);
  }

  res.json(monthlyData);
};

export default {
  addWaterPortion: ctrlWrapper(addWaterPortion),
  updateWaterPortion: ctrlWrapper(updateWaterPortion),
  deleteWaterPortion: ctrlWrapper(deleteWaterPortion),
  todayWaterPortion: ctrlWrapper(todayWaterPortion),
  monthlyWaterPortion: ctrlWrapper(monthlyWaterPortion),
};
