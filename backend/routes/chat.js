const express = require("express");
const { isAuthenticateUser } = require("../middleware/authentication");
const { sendMessage, getMessage, updateMessage, deleteMessage, getAllMessage, sendGroupMsg, createGroup } = require("../controller/chatController");
const multer = require("multer");
const router = express.Router();
const path=require("path");


const upload=multer({
  storage:multer.diskStorage({
    destination:function(req,file,cb){
      console.log(`file:`, req)
      cb(null,path.join(__dirname,'..','uploads/sharedImages'))
    },
    filename:function(req,file,cb){
      console.log(`file:`, file)
      cb(null,file.originalname);
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

// router.route('/groupChat/:id').post(isAuthenticateUser, sendGroupMsg);

// router.route('/createGroup').post(isAuthenticateUser, createGroup);

module.exports = router;
