const mongoose = require("mongoose");
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
  console.log("sfadsgdsf",message);

  let image;

  if(req.file){
    image=`${req.protocol}://${req.get("host")}/uploads/sharedImages/${req.file.originalname}`
  }

  const toUser = await User.findById(toId);

  if (!toUser) {
    return next(new ErrorHandler("Reciveing ID is not found"));
  }

  if(!message && !image){
    return next(new ErrorHandler("Enter message or send image"));
  }

  const chat = await Chat.create({
    from: id,
    to: toId,
    message:!message ? undefined : message,
    image
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
  console.log("exports.deleteMessage ~ id:", id)
  await Chat.findByIdAndDelete(id);
  return res.status(200).json("Message deleted successfully");
});

exports.getAllMessage = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  console.log(`exports.getAllMessage=catchAsyncError ~ user:`, user);
  const userId = new mongoose.Types.ObjectId(user.id);

  await User.findByIdAndUpdate(userId,{active:Date.now()},{new :true});
  
  const message = await Chat.aggregate([
    {
      $match: {
        $or: [{ from: userId }, { to: userId }],
      },
    },
    {
      $addFields: {
        nameField: {
          $cond: { if: { $eq: [userId, "$from"] }, then: "$to", else: "$from" },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "nameField",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: "$user._id",
        name: { $first: "$user.name" },
        createdAt: { $first: "$created_at" },
        active: { $first: "$user.active" },
        profile:{ $first:"$user.profile"},
        message: {
          $push: {
            type: {
              $cond: {
                if: { $eq: [userId, "$from"] },
                then: "send",
                else: "received",
              },
            },
            id: "$_id",
            message: "$message",
            createdAt: "$created_at",
            image:"$image"
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // const message = await Chat.aggregate([
  //   {
  //     $match: {
  //       $or: [{ from: userId }, { to: userId }],
  //     },
  //   },
  //   {
  //     $addFields:{
  //       nameField: { $cond: { if: { $eq: [userId, "$from"] }, then: "$to", else: "$from" } },
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "nameField",
  //       foreignField: "_id",
  //       as: "user"
  //     }
  //   },
  //   {
  //     $unwind: "$user"
  //   },
  //   {$sort:{"created_at":1}},
  //   {
  //     $group: {
  //       _id: "$user._id",
  //       name: { $first: "$user.name" },
  //       message: {
  //         $push: {
  //           type: {
  //             $cond: {
  //               if: { $eq: [userId, "$from"] },
  //               then: "send",
  //               else: "received",
  //             },
  //           },
  //           id:"$_id",
  //           message: "$message",
  //           createdAt: "$created_at",
  //         },
  //       },
  //     },
  //   },
  // ]);

  console.log(message);

  return res.status(202).json(message);
});

