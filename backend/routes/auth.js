const express=require('express');
const { registerUser, getAllUser, OTPVerification, login, logout, forgotPassword, resetPassword } = require('../controller/authController');
const  router  = express.Router();


router.route('/getalluser').get(getAllUser);

router.route('/register').post(registerUser);

router.route('/otpVerify').get(OTPVerification);

router.route('/login').get(login);

router.route('/logout').get(logout);

router.route('/forgotPassword').get(forgotPassword);

router.route('/reset/:resetToken').post(resetPassword);

module.exports=router;