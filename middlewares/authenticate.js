import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import userService from "../services/usersServices.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Authorization headers not found"));
  }
  const [bearer, token] = authorization.split(" ");
  if (!bearer) {
    return next(HttpError(401, "Bearer not found"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await userService.findUser({ _id: id });
    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }
    if (!user.token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
export default authenticate;
