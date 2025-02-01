import { User } from "../models/userModel.js";

// admin login
export const adminLogin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      msg: "username and password are required!",
    });
  }

  if (username === "admin" && password === "admin123") {
    return res.status(200).json({
      msg: "Welcome admin!",
    });
  } else {
    return res.status(401).json({
      msg: "Wrong username or password",
    });
  }
};

//all users
export const userDetails = async (req, res) => {
  try {
    const users = await User.find({}).populate("banks");
    if (!users) {
      return res.status(404).json({
        msg: "No user found!",
      });
    }

    return res.status(200).json({
      msg: "User details fetched successfully!",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in fetching user details!",
      err: err.message,
    });
  }
};

// Search
export const search = async (req, res) => {
  try {
    const { username, bankName, accountNumber, branchName } = req.query;

    const query = {};

    if (username) {
      query.username = { $regex: username, $options: "i" }; // Case-insensitive regex search
    }

    const users = await User.find(query).populate("banks");

    if (!users || users.length === 0) {
      return res.status(404).json({
        msg: "No users found with the given search criteria!",
      });
    }

    return res.status(200).json({
      msg: "Users fetched successfully!",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in searching for users",
      err: err.message,
    });
  }
};
