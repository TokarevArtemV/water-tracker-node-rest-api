import multer from "multer";
import * as cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import dotenv from "dotenv";
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "avatars",
    allowedFormats: ["jpeg", "png", "jpg", "svg"],
    transformation: [{ width: 250, height: 250 }],
  },
});

const upload = multer({ storage });

export default upload;
