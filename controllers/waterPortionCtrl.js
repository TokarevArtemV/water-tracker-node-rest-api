import ctrlWrapper from "../helpers/ctrlWrapper.js";
import waterPortionServices from "../services/waterPortionServices.js";
import HttpError from "../helpers/HttpError.js";

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

export default {
    addWaterPortion: ctrlWrapper(addWaterPortion),
    updateWaterPortion: ctrlWrapper(updateWaterPortion),
    deleteWaterPortion: ctrlWrapper(deleteWaterPortion),
};
