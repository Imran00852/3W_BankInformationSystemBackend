import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(404).json({
        msg: "username,email and password is required!",
      });
    }
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        msg: "User already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const accessToken = jwt.sign(
      { token: savedUser._id },
      process.env.JWTSECRET,
      { expiresIn: "30d" }
    );

    return res
      .status(201)
      .cookie("token", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        msg: `User registered successfully! Welcome ${savedUser.username}`,
        user: savedUser,
      });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in registration !",
      err: err.msg,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        msg: "Email and Password are required!",
      });
    }

    const userExist = await User.findOne({ email }).select("+password");
    if (!userExist) {
      return res.status(404).json({
        msg: "User with this email does not exist.Please register!",
      });
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid email id or password!",
      });
    }
    const accessToken = jwt.sign(
      { token: userExist._id },
      process.env.JWTSECRET,
      { expiresIn: "30d" }
    );

    res
      .status(200)
      .cookie("token", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        msg: "Logged in successfully!",
        user: userExist,
      });
  } catch (err) {
    return res.status(500).json({
      msg: "Error while logging in!",
      err: err.message,
    });
  }
};

//getMyDetails
export const getMyDetails = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

//logout
export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      msg: "You logged out!",
    });
};
