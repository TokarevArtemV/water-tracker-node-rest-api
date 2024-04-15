import { Schema, model } from "mongoose";
import { EMAIL_REGEX} from '../constants/regexPatterns.js';
import hooks from "./hooks.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: EMAIL_REGEX,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      maxLength: 64,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    username: {
      type: String,
      maxLength: 32,
      default: null,
    },
    waterRate: {
      type: Number,
      default: 2000,
      min: 1,
      max: 15000,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", hooks.handleSaveError);
userSchema.pre("findOneAndUpdate", hooks.setUpdateSettings);
userSchema.post("findOneAndUpdate", hooks.handleSaveError);

const User = model("user", userSchema);

export default User;
