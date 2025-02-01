import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).json({
        msg: "Login first!",
      });
    }
    const decodedData = jwt.verify(token, process.env.JWTSECRET);

    const user = await User.findById(decodedData.token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      msg: "Error in auth!",
      err: err.message,
    });
  }
};
