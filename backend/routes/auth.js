const express = require("express");
const {
  registerUser,
  getAllUser,
  OTPVerification,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  chagePassword,
} = require("../controller/authController");
const { isAuthenticateUser } = require("../middleware/authentication");
const router = express.Router();
const multer=require("multer");
const path = require("path");

const upload=multer({storage:multer.diskStorage({
  destination:function(req,file,cb){
    console.log("req",req); 
    cb(null,path.join(__dirname,"..","uploads"))
  },
  filename:function(req,file,cb){
    console.log(`file.originalname:`, file.originalname)
    cb(null,file.originalname);
  }
})})

router.route("/getalluser").get(getAllUser);

router.route("/register").post(upload.single("profile"),registerUser);

router.route("/otpVerify").post(OTPVerification);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotPassword").get(forgotPassword);

router.route("/reset/:resetToken").post(resetPassword);

router.route("/getuser").get(isAuthenticateUser,getUserProfile);

router.route("/change-password").put(isAuthenticateUser,chagePassword);

module.exports = router;
