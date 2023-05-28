const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const Group=require("../model/group");
const Groupchat=require("../model/groupChatModel");
const ErrorHandler = require("../utils/errorHandler");


exports.createGroup=catchAsyncError(async(req,res,next)=>{
    const {
      user: { id },
      body: { name,description,participance },
    } = req;

    const foundedParticipent=await User.find({_id:{$in:participance}}).distinct('_id').lean();
    
    const demoString=foundedParticipent.map(item=>item.toString());

    const misMatchedparticipance=participance.reduce((_,item)=>!demoString.includes(item)?item:null,[]);

    if(misMatchedparticipance?.length){
        return next(new ErrorHandler(`This user's are not found ${misMatchedparticipance.toString()}`));
    }
    
    await Group.create({
        name,description,participance:[...participance,id],created_by:id
    });

    return res.status(200).json("Group create successfully");
  
});

exports.sendGroupMsg=catchAsyncError(async(req,res,next)=>{
    const {
      params: { toGroupId },
      user: { id },
      body: { message,location },
    } = req;

    const group=await Group.findById(toGroupId);

    if(!group){
      return next(new ErrorHandler("group not found"));
    }

   const groupChat= await Groupchat.create({
      // participance:[...group.participance,id],
      message,
      send_by:id,
      group:toGroupId
    })
    
    return res.json(groupChat)
    
});


