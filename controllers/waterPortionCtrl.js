import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";
import HttpError from "../helpers/HttpError.js";
import { addHours, format } from "date-fns";

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

  const result = await waterPortionServices.todayWaterPortion({ owner });
  const today = new Date().toUTCString();
  const today2 = new Date();
  console.log(today, today2);
  //   const currentHour = today.getHours();
  //   today.setHours(currentHour + 3);
  //   const todayWithAddedHours = today.toUTCString();
  const formattedDate = format(today, "yyyy-MM-dd");

  if (result) {
    const filteredResult = result.filter(({ date }) => {
      //   const test = date.toLocaleDateString("uk-UA");
      //   const updatedDate = addHours(date, -3);
      const test =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      const stringDate = format(date, "yyyy-MM-dd-hh");
      console.log(date, test, formattedDate);
      return stringDate === formattedDate;
    });

    res.json(filteredResult);
  } else {
    res.status(404).json({ message: "No water portions found for today" });
  }
  res.json(result);
};

export default {
  addWaterPortion: ctrlWrapper(addWaterPortion),
  updateWaterPortion: ctrlWrapper(updateWaterPortion),
  deleteWaterPortion: ctrlWrapper(deleteWaterPortion),
  todayWaterPortion: ctrlWrapper(todayWaterPortion),
};
