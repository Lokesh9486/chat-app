const express=require('express');
const { registerUser, getAllUser } = require('../controller/authController');
const  router  = express.Router();


router.route('/getalluser').get(getAllUser);

router.route('/register').post(registerUser);

module.exports=router;