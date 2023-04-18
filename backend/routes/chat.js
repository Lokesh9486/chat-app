const express = require("express");
const { isAuthenticateUser } = require("../middleware/authentication");
const { sendMessage, getMessage, updateMessage, deleteMessage, getAllMessage } = require("../controller/chatController");
const router = express.Router();


router.route("/message").get(isAuthenticateUser,getAllMessage);

router
  .route("/message/:toId")
  .post(isAuthenticateUser, sendMessage)
  .get(isAuthenticateUser, getMessage);

router.route("/message/update").put(isAuthenticateUser, updateMessage)

router.route("/message/delete").delete(isAuthenticateUser, deleteMessage)

module.exports = router;
