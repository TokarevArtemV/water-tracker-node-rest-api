import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

const resizeFile = async (req, _, next) => {
  if (!req.file) next(HttpError(400, "Avatar not found"));

  const { path: pathAvatar } = req.file;

  Jimp.read(pathAvatar)
    .then((file) => {
      return file
        .contain(250, 250) // resize
        .write(pathAvatar); // save
    })
    .then((resizedFile) => {
      if (!resizedFile)
        next(HttpError(400, "Something wrond with your avatar"));
      next();
    })
    .catch((err) => {
      next(HttpError(400, err.message));
    });
};

export default resizeFile;
