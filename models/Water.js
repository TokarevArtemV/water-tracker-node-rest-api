import { Schema, model } from "mongoose";
import hooks from "./hooks.js";

const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, "Amount of water is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: () => new Date().toUTCString(),
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Owner is required"],
    },
    dailyNorm: {
      type: Number,
      ref: "user",
      required: [true, "Daily norm is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

waterSchema.post("save", hooks.handleSaveError);
waterSchema.pre("findOneAndUpdate", hooks.setUpdateSettings);
waterSchema.post("findOneAndUpdate", hooks.handleSaveError);

const Water = model("water-portions", waterSchema);

export default Water;
