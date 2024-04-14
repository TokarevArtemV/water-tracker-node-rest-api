import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";

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

export default {
  addWaterPortion: ctrlWrapper(addWaterPortion),
};
