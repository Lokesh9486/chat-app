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

router.route("/getalluser").get(getAllUser);

router.route("/register").post(registerUser);

router.route("/otpVerify").post(OTPVerification);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/forgotPassword").get(forgotPassword);

router.route("/reset/:resetToken").post(resetPassword);

router.route("/getuser").get(isAuthenticateUser,getUserProfile);

router.route("/change-password").put(isAuthenticateUser,chagePassword);

module.exports = router;
