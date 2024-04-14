import Water from "../models/Water.js";

const addWaterPortion = (data) => Water.create(data);

export default {
    addWaterPortion,
};
