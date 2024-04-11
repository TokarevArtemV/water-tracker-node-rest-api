import { Schema, model } from "mongoose";

const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, "Amount of water is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Owner is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Water = model("water", waterSchema);

export default Water;
