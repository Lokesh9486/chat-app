const express = require("express");
const { isAuthenticateUser } = require("../middleware/authentication");
const { sendMessage, getMessage, updateMessage, deleteMessage, getAllMessage } = require("../controller/chatController");
const multer = require("multer");
const router = express.Router();
const path=require("path");
const { createGroup , sendGroupMsg} = require("../controller/groupController");

//upload.single("avatar") single
//upload.array("avatar") multi 

const upload=multer({
  storage:multer.diskStorage({
    destination:function(req,file,cb){
      console.log(`file:`, req)
      cb(null,path.join(__dirname,'..','uploads/sharedImages'))
    },
    filename:function(req,file,cb){
      console.log(`file:`, file);
      const uniqueSuffix=Date.now()+"_"+Math.round(Math.random()*1E9)
      console.log(uniqueSuffix,file.fieldname);
      cb(null,file.fieldname+'_'+uniqueSuffix+file.originalname);
    }
  })
})

router.route("/message").get(isAuthenticateUser,getAllMessage);

router
  .route("/message/:toId")
  .post(isAuthenticateUser,upload.single("image"), sendMessage)
  .get(isAuthenticateUser, getMessage);

router.route("/message/update").put(isAuthenticateUser, updateMessage)

router.route("/message/delete").delete(isAuthenticateUser, deleteMessage);

router.route('/groupChat/:toGroupId').post(isAuthenticateUser,upload.single("image"), sendGroupMsg);

router.route('/createGroup').post(isAuthenticateUser,upload.single("image"), createGroup);

module.exports = router;
