const mongoose = require("mongoose");
const { catchAsyncError } = require("../middleware/catchAsyncError");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const Group=require("../model/group");

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const {
    params: { toId },
    user: { id },
    body: { message,location },
  } = req;

  let image;

  if(req.file){
    image=`${req.protocol}://${req.get("host")}/uploads/sharedImages/${req.file.originalname}`
  }

  const toUser = await User.findById(toId);

  if (!toUser) {
    return next(new ErrorHandler("Reciveing ID is not found"));
  }

  if(!message && !image && !JSON.parse(location).length){
    return next(new ErrorHandler("Enter message or send image,location"));
  }

  const chat = await Chat.create({
    from: id,
    to: toId,
    message:!message ? undefined : message,
    image,
    location:JSON.parse(location).length&&{type:"Point",coordinates:JSON.parse(location)}
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

  const group=await Group.aggregate([
    {$match:{participance:userId}},
    {
      $lookup:{
        from:"groupchats",
        localField:"_id",
        foreignField:"group",
        as:"groupChat"
      }
    },
    {
      $lookup:{
        from:"users",
        localField:"groupChat.send_by",
        foreignField:"_id",
        as:"sender"
      }
    },
    {$unwind:"$sender"},
    {$unwind:"$groupChat"},
    {
      $project:{"sender.password":0,"sender.OTP":0,"sender.OTPExpires":0,"sender.created_at":0,"sender.OTPVerifed":0,"sender.__v":0,}
    },
    {
      $group:{
        _id:"$_id",
        name:{$first:"$name"},
        groups:{$first:true},
        description:{$first:"$description"},
        profile:{$first:"$profile"},
        created_by:{$first:"$created_by"},
        message:{
         $push:{
          type:{
            $cond:{
              if:{$eq:[userId,"$groupChat.send_by"]},then:"send",else:"received"
            }
          },
          message:"$groupChat.message",
          created_at:"$groupChat.created_at",
          send_by:{
            id:"$groupChat.send_by",
            name:"$sender.name",
            email:"$sender.email",
            profile:"$sender.profile",
            active:"$sender.active",
          },
         }
        },
        // data:{$first:"$groupChat"},
        // sender:{$first:"$sender"},
        // demo:{$first:"$name"}
      }
    },
    { $sort: { "message.createdAt": -1 } },
  ]);
  console.log("exports ~ group:", group)
  
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
            image:"$image",
            location:"$location"
          },
          //  $sort: { "created_at": -1 } 
        },
      },
    },
    { $sort: { "message.createdAt": -1 } },
  ]);

  // const message = await Chat.aggregate([
  //   {
  //     $match: {
  //       $or: [{ from: userId }, { to: userId }],
  //     },
  //   },
  //   {
  //     $addFields: {
  //       nameField: {
  //         $cond: { if: { $eq: [userId, "$from"] }, then: "$to", else: "$from" },
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "nameField",
  //       foreignField: "_id",
  //       as: "user",
  //     },
  //   },
  //   {
  //     $unwind: "$user",
  //   },
  //   {
  //     $group: {
  //       _id: "$user._id",
  //       name: { $first: "$user.name" },
  //       createdAt: { $first: "$created_at" },
  //       active: { $first: "$user.active" },
  //       profile:{ $first:"$user.profile"},
  //       message: {
  //         $push: {
  //           type: {
  //             $cond: {
  //               if: { $eq: [userId, "$from"] },
  //               then: "send",
  //               else: "received",
  //             },
  //           },
  //           id: "$_id",
  //           message: "$message",
  //           createdAt: "$created_at",
  //           image:"$image",
  //           location:"$location"
  //         },
  //         //  $sort: { "created_at": -1 } 
  //       },
  //     },
  //   },
  //   { $sort: { "message.createdAt": -1 } },
  // ]);


  // console.log(message);

  return res.status(202).json([...message,...group]);
});



