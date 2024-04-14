import WaterModal from "../models/Water.js";

const addWaterPortion = (data) => WaterModal.create(data);

export default {
    addWaterPortion,
};
