import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";

const addWaterPortion = async (req, res) => {
    const result = await waterPortionServices.addWaterPortion(req.body);
    res.status(201).json(result);
};

export default {
    addWaterPortion: ctrlWrapper(addWaterPortion),
};
