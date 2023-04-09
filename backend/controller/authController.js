const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendOTPMail");
const crypto = require("crypto");
const sendToken = require("../utils/jwt");

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

const generateOTP = crypto.randomInt(1000, 10000).toString();

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    OTP: generateOTP,
  });

  res.status(200).write("successfully registered");
  sendEmail({ email: user.email, generateOTP, res });
});

exports.OTPVerification = catchAsyncError(async (req, res, next) => {
  const { otp, email } = req.body;
  if (!email || !otp) {
    next(new ErrorHandler("Please enter email and otp", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid user", 404));
  }
  if (user.OTP != otp) {
    return next(new ErrorHandler("OTP not match with user",404));
  }
  user.OTPVerifed = true;
  await user.save({
    validateBefore: false,
  });
  sendToken(user, 200, res, "OTP verified sucessfully");
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!user.isValidPassword(password)) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!user.OTPVerifed) {
    user.OTP=generateOTP;
    await user.save({
      validateBefore:true
    })
    return sendEmail({ email: user.email, generateOTP, res });
  }
  return sendToken(user, 200, res, "Login successfully");
});

exports.logout=(req,res,next)=>{
   res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpsOnly:true
   }).send("logout successful");
}