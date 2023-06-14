const { catchAsyncError } = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const Group=require("../model/group");
const Groupchat=require("../model/groupChatModel");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");


exports.createGroup=catchAsyncError(async(req,res,next)=>{
    const {
      user: { id },
      body: { name,description,participance },
    } = req;

    let profile;

    if (req.file) {
      profile = `${req.protocol}://${req.get("host")}/uploads/sharedImages/${
        req.file.filename
      }`;
    }

    const participances=JSON.parse(participance);
    const foundedParticipent=await User.find({_id:{$in:participances}}).distinct('_id').lean();
    
        const demoString=foundedParticipent.map(item=>item.toString());
    
        const misMatchedparticipance=participances.reduce((_,item)=>!demoString.includes(item)?item:null,[]);
    
        if(misMatchedparticipance?.length){
            return next(new ErrorHandler(`This user's are not found ${misMatchedparticipance.toString()}`));
        }
        
        await Group.create({
            name,description,profile,participance:[...participances,id],created_by:id
        });
    
        return res.status(200).json("Group create successfully");
  
});

exports.sendGroupMsg=catchAsyncError(async(req,res,next)=>{
    const {
      params: { toGroupId },
      user: { id },
      body: { message,location },
    } = req;

    let image;

    // console.log(message,image,location)

    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/sharedImages/${
        req.file.filename
      }`;
    }

    const group=await Group.findById(toGroupId);

    if(!group){
      return next(new ErrorHandler("group not found"));
    }

    if (!message && !image && !JSON.parse(location).length) {
      return next(new ErrorHandler("Enter message or send image,location"));
    }
    
     const groupChat= await Groupchat.create({
      participance:group.participance,
      message: !message ? undefined : message,
      image,
      location:JSON.parse(location).length &&  {
      type: "Point",
      coordinates: JSON.parse(location),
      },
      send_by:id,
      group:toGroupId
    })
    
    return res.status(200).json(groupChat)
    
});

exports.getSingleGroup=catchAsyncError(async(req,res,next)=>{
  const {groupId}=req.params;
    const id= new mongoose.Types.ObjectId(groupId);
    const user=await Group.aggregate()
    .match({_id:id})
    .lookup({from:'users',localField:'created_by',foreignField:'_id',as:'createdBy'})
    .lookup({from:'users',localField:'participance',foreignField:'_id',as:'participances'})
    .unwind("createdBy","participances")
    .group({
      _id:"$_id",
      name:{$first:"$name"},
      description:{$first:"$description"},
      profile:{$first:"$profile"},
      created_by:{$first:"$createdBy.name"},
      participance:{$push:{name:"$participances.name",profile:"$participances.profile",email:"$participances.email"}}
    });
   return res.status(200).json(user);
})

exports.deleteGroupMsg=catchAsyncError(async(req,res,next)=>{
  const { id } = req.params;
  const user=req.user;
  const isParticipant=await Groupchat.find({participance:user});
  
  if(!isParticipant){
    return res.status(200).json("user is not a participant")
  }

  const result=await Groupchat.findByIdAndDelete(id);

  if(!result){
    return res.status(200).json("Unable to delete message")
  }

  return res.status(200).json("Message deleted successfully");
})
