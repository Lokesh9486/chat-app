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

    const participances=JSON.parse(participance);
    const foundedParticipent=await User.find({_id:{$in:participances}}).distinct('_id').lean();
    
        const demoString=foundedParticipent.map(item=>item.toString());
    
        const misMatchedparticipance=participances.reduce((_,item)=>!demoString.includes(item)?item:null,[]);
    
        if(misMatchedparticipance?.length){
            return next(new ErrorHandler(`This user's are not found ${misMatchedparticipance.toString()}`));
        }
        
        await Group.create({
            name,description,participance:[...participances,id],created_by:id
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

    console.log(message,image,location)

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


