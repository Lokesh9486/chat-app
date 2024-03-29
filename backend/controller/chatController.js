const mongoose = require("mongoose");
const { catchAsyncError } = require("../middleware/catchAsyncError");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const Group = require("../model/group");
const { getIO } = require("../utils/socket");

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const {
    params: { toId },
    user: { id },
    body: { message, location },
  } = req;

  let image;

  if (req.file) {
    image = `${req.protocol}://${req.get("host")}/uploads/sharedImages/${
      req.file.filename
    }`;
  }

  const toUser = await User.findById(toId);

  if (!toUser) {
    return next(new ErrorHandler("Reciveing ID is not found"));
  }

  if (!message && !image && !JSON.parse(location).length) {
    return next(new ErrorHandler("Enter message or send image,location"));
  }

  const chat = await Chat.create({
    from: id,
    to: toId,
    message: !message ? undefined : message,
    image,
    location: JSON.parse(location).length && {
      type: "Point",
      coordinates: JSON.parse(location),
    },
  });

  // const io=getIO();
  // io.on("join-room",toId=>{
  //   console.log("join room testing",toId);
  //   io.join(toId);
  //   io.to(toId).emit("message",chat)
  // });

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

  const toIdUser=new mongoose.Types.ObjectId(toId);
  const idUser=new mongoose.Types.ObjectId(id);
  const message1=await Chat.aggregate([
    {
      $match:{
        $or:[{ from: idUser, to: toIdUser },{ from: toIdUser, to: idUser }]
      }
    },
    {
      $addFields: {
        nameField: {
          $cond: { if: { $eq: [idUser, "$from"] }, then: "$to", else: "$from" },
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
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$user._id",
        name: { $first: "$user.name" },
        createdAt: { $first: "$created_at" },
        active: { $first: "$user.active" },
        profile: { $first: "$user.profile" },
        message: {
          $addToSet: {
            type: {
              $cond: {
                if: { $eq: [idUser, "$from"] },
                then: "send",
                else: "received",
              },
            },
            id: "$_id",
            message: "$message",
            createdAt: "$created_at",
            image: "$image",
            location: "$location",
          },
        },
      },
    },
  ]
  )
  console.log(message1)
  return res.status(202).json( message1 );
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
  console.log("exports.deleteMessage ~ id:", id);
  await Chat.findByIdAndDelete(id);
  return res.status(200).json("Message deleted successfully");
});

exports.getAllMessage = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const userId = new mongoose.Types.ObjectId(user.id);
  await User.findByIdAndUpdate(userId, { active: Date.now() }, { new: true });

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
        findInGroup: {
          $cond: { if: { $eq: [userId, "$to"] }, then: "$to", else: "$from" },
        },
      },
    },
    {
      $lookup: {
        from: "groups",
        localField: "findInGroup",
        foreignField: "participance",
        as: "groups",
      },
    },
    {
      $lookup: {
        from: "groupchats",
        localField: "groups._id",
        foreignField: "group",
        as: "groupChat",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "groupChat.send_by",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "groups.created_by",
        foreignField: "_id",
        as: "groupCreatedBy",
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
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$groups",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$groupChat",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$sender",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$groupCreatedBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $facet: {
        personalChat: [
          {
            $group: {
              _id: "$user._id",
              name: { $first: "$user.name" },
              createdAt: { $first: "$created_at" },
              active: { $first: "$user.active" },
              profile: { $first: "$user.profile" },
              message: {
                $addToSet: {
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
                  image: "$image",
                  location: "$location",
                },
              },
            },
          },
          {
            $unwind: "$message",
          },
          {
            $sort: { "message.createdAt": 1 },
          },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              createdAt: { $first: "$createdAt" },
              active: { $first: "$active" },
              profile: { $first: "$profile" },
              message: { $push: "$message" },
            },
          },
          {
            $project: {
              _id: 0,
              personalChat: {
                $cond: [{ $eq: ["$_id", null] }, [], "$$ROOT"],
              },
            },
          },
          {
            $unwind: "$personalChat",
          },
          {
            $replaceRoot: { newRoot: "$personalChat" },
          },
        ],
        groupChat: [
          {
            $group: {
              _id: "$groups._id",
              group: { $first: true },
              name: { $first: "$groups.name" },
              description: { $first: "$groups.description" },
              profile: { $first: "$groups.profile" },
              created_at: { $first: "$groups.created_at" },
              created_by: { $first: "$groupCreatedBy.name" },
              message: {
                $addToSet: {
                  $cond: {
                    if: {
                      $and: [
                        { $eq: ["$groupChat.send_by", "$sender._id"] },
                        { $eq: ["$groupChat.group", "$groups._id"] },
                      ],
                    },
                    then: {
                      type: {
                        $cond: {
                          if: { $eq: [userId, "$groupChat.send_by"] },
                          then: "send",
                          else: "received",
                        },
                      },
                      id: "$groupChat._id",
                      message: "$groupChat.message",
                      image: "$groupChat.image",
                      location: "$groupChat.location",
                      createdAt: "$groupChat.created_at",
                      send_by: {
                        id: "$groupChat.send_by",
                        name: "$sender.name",
                        email: "$sender.email",
                        profile: "$sender.profile",
                        active: "$sender.active",
                      },
                    },
                    else: { createdAt: "$groups.created_at" },
                  },
                },
              },
            },
          },
          {
            $unwind: "$message",
          },
          {
            $sort: { "message.createdAt": 1 },
          },
          {
            $group: {
              _id: "$_id",
              name: { $first: "$name" },
              group: { $first: true },
              created_at: { $first: "$created_at" },
              description: { $first: "$description" },
              created_by: { $first: "$created_by" },
              active: { $first: "$active" },
              profile: { $first: "$profile" },
              message: { $push: "$message" },
            },
          },
          // {
          //   $project: {
          //     _id: 0,
          //     groupChat: {
          //       $cond: [{ $eq: ["$_id", null] }, [], "$$ROOT"],
          //     },
          //   },
          // },
          // {
          //   $unwind: "$groupChat",
          // },
          // {
          //   $replaceRoot: { newRoot: "$groupChat" },
          // },
          {
            $project: {
              _id: 0,
              groupChat: {
                $cond: [{ $eq: ["$_id", null] }, [], "$$ROOT"],
              },
            },
          },
          {
            $unwind: "$groupChat",
          },
          {
            $replaceRoot: { newRoot: "$groupChat" },
          },
        ],
      },
    },
    {
      $project: {
        combinedChat: {
          $concatArrays: ["$personalChat", "$groupChat"],
        },
      },
    },
    {
      $unwind: "$combinedChat",
    },
    {
      $replaceRoot: { newRoot: "$combinedChat" },
    },
    { $sort: { "message.createdAt": -1 } },
  ]);

  //   const message1 = await Chat.aggregate([
  //     {
  //       $match: {
  //         $or: [{ from: userId }, { to: userId }],
  //       },
  //     },
  //     {
  //       $addFields: {
  //         nameField: {
  //           $cond: { if: { $eq: [userId, "$from"] }, then: "$to", else: "$from" },
  //         },
  //         findInGroup: {
  //           $cond: { if: { $eq: [userId, "$to"] }, then: "$to", else: "$from" },
  //         },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "groups",
  //         localField: "findInGroup",
  //         foreignField: "participance",
  //         as: "groups",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "groupchats",
  //         localField: "groups._id",
  //         foreignField: "group",
  //         as: "groupChat",
  //       },
  //     },
  //     // {
  //     //   $lookup: {
  //     //     from: "users",
  //     //     localField: "groupChat.send_by",
  //     //     foreignField: "_id",
  //     //     as: "sender",
  //     //   },
  //     // },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "groups.created_by",
  //         foreignField: "_id",
  //         as: "groupCreatedBy",
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "nameField",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$user",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$groups",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$groupChat",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     // {
  //     //   $unwind: {
  //     //     path: "$sender",
  //     //     preserveNullAndEmptyArrays: true,
  //     //   },
  //     // },
  //     {
  //       $unwind: {
  //         path: "$groupCreatedBy",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //   {
  //     $facet: {
  //       personalChat: [
  //         {
  //           $group: {
  //             _id: "$user._id",
  //             name: { $first: "$user.name" },
  //             email: { $first: "$user.email" },
  //             createdAt: { $first: "$created_at" },
  //             profile: { $first: "$user.profile" },
  //             message: {
  //               $addToSet: {
  //                 message: "$message",
  //                 createdAt: "$created_at",
  //                 image: "$image",
  //                 location: "$location",
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $unwind: "$message",
  //         },
  //         {
  //           $sort: { "message.createdAt": 1 },
  //         },
  //         {
  //           $group: {
  //             _id: "$_id",
  //             name: { $first: "$name" },
  //             createdAt: { $first: "$createdAt" },
  //             profile: { $first: "$profile" },
  //             message: { $last: "$message" },
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             personalChat: {
  //               $cond: [{ $eq: ["$_id", null] }, [], "$$ROOT"],
  //             },
  //           },
  //         },
  //         {
  //           $unwind: "$personalChat",
  //         },
  //         {
  //           $replaceRoot: { newRoot: "$personalChat" },
  //         },
  //       ],
  //       groupChat: [
  //         {
  //           $group: {
  //             _id: "$groups._id",
  //             group: { $first: true },
  //             name: { $first: "$groups.name" },
  //             description: { $first: "$groups.description" },
  //             profile: { $first: "$groups.profile" },
  //             created_at: { $first: "$groups.created_at" },
  //             created_by: { $first: "$groupCreatedBy.name" },
  //             message: {
  //               $addToSet: {
  //                 $cond: {
  //                   if: {
  //                     // $and: [
  //                     //   { $eq: ["$groupChat.send_by", "$sender._id"] },
  //                       // { 
  //                         $eq: ["$groupChat.group", "$groups._id"]
  //                       //  },
  //                     // ],
  //                   },
  //                   then: {
  //                     message: "$groupChat.message",
  //                     image: "$groupChat.image",
  //                     location: "$groupChat.location",
  //                     createdAt: "$groupChat.created_at"
  //                   },
  //                   else: { createdAt: "$groups.created_at" },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $unwind: "$message",
  //         },
  //         {
  //           $sort: { "message.createdAt": 1 },
  //         },
  //         {
  //           $group: {
  //             _id: "$_id",
  //             name: { $first: "$name" },
  //             group: { $first: true },
  //             created_at: { $first: "$created_at" },
  //             description: { $first: "$description" },
  //             created_by: { $first: "$created_by" },
  //             profile: { $first: "$profile" },
  //             message: { $last: "$message" },
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             groupChat: {
  //               $cond: [{ $eq: ["$_id", null] }, [], "$$ROOT"],
  //             },
  //           },
  //         },
  //         {
  //           $unwind: "$groupChat",
  //         },
  //         {
  //           $replaceRoot: { newRoot: "$groupChat" },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $project: {
  //       combinedChat: {
  //         $concatArrays: ["$personalChat", "$groupChat"],
  //       },
  //     },
  //   },
  //   {
  //     $unwind: "$combinedChat",
  //   },
  //   {
  //     $replaceRoot: { newRoot: "$combinedChat" },
  //   },
  //   { $sort: { "message.createdAt": -1 } },
  // ]);

  console.log("exports.getAllMessage=catchAsyncError ~ message1:", message);

  return res.status(202).json(message);
});
