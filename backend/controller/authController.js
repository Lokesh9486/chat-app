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

// const BASE_URL=`${req.protocol}://${req.get('host')}`

// const generateOTP = crypto.randomInt(1000, 10000).toString();

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let profile;
  if(req.file){
    profile=`${req.protocol}://${req.get("host")}/uploads/user/${req.file.originalname}`
  }
    const user = await User.create({
      name,
      email,
      password,
      profile,
      OTP: crypto.randomInt(1000, 10000).toString(),
      OTPExpires:Date.now()+30*60*1000
    });
    
    // sendEmail({
    //   email: user.email,
    //   res,
    //   subject: `OTP sended by chat-app`,
    //   message: `<h1>${crypto.randomInt(1000, 10000).toString()}</h1>`,
    // });
    res.status(200).json(`Register successfully and OTP send ${email}`);
});

exports.OTPVerification = catchAsyncError(async (req, res, next) => {
  const { otp, email } = req.body;
  if (!email || !otp) {
    next(new ErrorHandler("Please enter email and otp", 400));
  }
  const user = await User.findOne({ email,OTPExpires:{$gt:Date.now()} });
  if (!user) {
    return next(new ErrorHandler("Invalid user or OTP expired", 404));
  }
  if (user.OTP != otp) {
    return next(new ErrorHandler("OTP not match with user", 404));
  }
  user.OTPVerifed = true;
  await user.save({
    validateBeforeSave: false,
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
  if (!await user.isValidPassword(password)) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!user.OTPVerifed) {
    user.OTP = crypto.randomInt(1000, 10000).toString();
    user.OTPExpires=Date.now()+30*60*1000;
    await user.save({
      validateBefore: true,
    });
    //  sendEmail({
    //   email: user.email,
    //   res,
    //   subject: `OTP sended by chat-app`,
    //   message: `<h1>${crypto.randomInt(1000, 10000).toString()}</h1>`,
    // });
   return res.status(200).json(`Login successfully and OTP send ${email}`);
  }
  return sendToken(user, 200, res, "Login successfully");
});

exports.logout = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpsOnly: true,
    })
    .send("logout successful");
};

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter email ", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler(" Email does not match with user", 400));
  }
  const resetToken = user.resetToken();
  console.log(`exports.forgotPassword=catchAsyncError ~ resetToken:`, resetToken)
  await user.save({ validateBeforeSave: false });
  let resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/chat/reset/${resetToken}`;
  const message = `Password reset URL \n\n<b>${resetUrl}</b>`;

  try {
    sendEmail({
      email: user.email,
      res,
      subject: `Password reset url`,
      message,
    });
    return res.status(200).json(`Email sent to ${email} ${resetToken}`);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
  const {params:{resetToken},body:{password,confirmPassword}}=req;
  if(!password || !confirmPassword){
    return next(new ErrorHandler("Enter password and confirmPassword"));
  }
  const resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire:{
      $gt:Date.now()
    }
  })
  if(!user){
    return next(new ErrorHandler('password reset token is invalid or expires',404))
  }
  if(password != confirmPassword){
    return next(new ErrorHandler("Password does not match"));
  }
  user.password=password;
  user.resetPasswordToken=undefined;
  user.resetPasswordTokenExpire=undefined;
  await user.save({validateBeforeSave:false});
  return sendToken(user, 200, res, "Password reseted successfully");
})

exports.getUserProfile=catchAsyncError(async(req,res,next)=>{
   const user=await User.findById(req.user.id);
   res.status(200).json({
    success:true,
    user
   })
})

exports.chagePassword=catchAsyncError(async(req,res,next)=>{
  const {user:{id},body:{password,oldpassword}}=req;
  console.log(`exports.chagePassword=catchAsyncError ~ id:`, id)
  const user=await User.findById(id).select('+password');
  if(!await user.isValidPassword(oldpassword)){
    return next(new ErrorHandler('Old password is incorrect',401));
  }
  user.password=password;
  await user.save();
  res.status(200).json("Password changed successfully");
})

exports.searchUserProfile=catchAsyncError(async(req,res,next)=>{
   const {user}=req.params;
  const users=  await User.find( { name:  new RegExp(`${user}`, "i")} ).select('-OTP -OTPExpires -OTPVerifed -created_at -__v');
  return res.status(200).json(users);
})

exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id).select("-OTP -OTPExpires -created_at -__v -OTPVerifed");
    res.status(200).json(user);
})