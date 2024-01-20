const User = require("../model/userModel");
const generateToken = require("../utils/features");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(404).json({
        success: false,
        message: "Fill the all fileds !!",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "User Already Exists!!",
      });

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the User");
    }
  } catch (error) {
    next(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });

    console.log(user.name);
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
const allUsers = asyncHandler(async (req, res) => {

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

 
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  
  console.log(users);

  res.send(users);
});

module.exports = { registerUser ,login ,allUsers };

