import Water from "../models/Water.js";

const addWaterPortion = (data) => Water.create(data);

const updateWaterPortion = (id, data) => Water.findByIdAndUpdate(id, data);

const deleteWaterPortion = (id) => Water.findByIdAndDelete(id);

const todayWaterPortion = (filter) => Water.find(filter);

export default {
  addWaterPortion,
  updateWaterPortion,
  deleteWaterPortion,
  todayWaterPortion,
};
