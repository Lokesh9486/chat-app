const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendEmail = require("../utils/sendOTPMail");
const crypto = require("crypto");

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  const generateOTP = () => {
    const otp =  crypto.randomInt(1000,10000).toString();
    return otp;
  };
  res.send(crypto.randomInt(1000,10000).toString());
  // sendEmail({ email: user.email,generateOTP });
  // res.status(200).json({
  //   success: true,
  //   message: "successfully registered",
  // });
});
