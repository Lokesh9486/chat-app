const { catchAsyncError } = require("../middleware/catchAsyncError");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const {
    params: { toId },
    user: { id },
    body: { message },
  } = req;
  const toUser = await User.findById(toId);
  if (!toUser) {
    return next(new ErrorHandler("Reciveing ID is not found"));
  }
  const chat = await Chat.create({
    from: id,
    to: toId,
    message: message,
  });
  return res.status(200).json({ message: "Message sended successfully", chat });
});

exports.getMessage = catchAsyncError(async (req, res, next) => {
  const {
    params: { toId },
    user: { id },
  } = req;
  const toUser = await User.findById(toId);
  if (!toUser) {
    return next(new ErrorHandler("Reciveing ID is not found"));
  }
  const message = await Chat.find({ from: id, to: toId }).select([
    "-from",
    "-to",
  ]);
  return res.status(202).json({ message });
});

exports.updateMessage = catchAsyncError(async (req, res, next) => {
  const { id, message } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    id,
    { message },
    {
      new: true,
    }
  );
  return res.status(200).json({ chat });
});

exports.deleteMessage = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;
  await Chat.findByIdAndDelete(id);
  return res.status(200).json("Message deleted successfully");
});

exports.getAllMessage = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const message = await Chat.find({ from: user.id });
  return res.status(202).json({ message,user });
});
