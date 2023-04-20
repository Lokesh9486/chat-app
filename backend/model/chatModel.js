const {Schema,model,SchemaTypes}=require('mongoose');

const chatSchema=new Schema({
    from:{
        type:SchemaTypes.ObjectId,
        required:true,
        ref:"user"
    },
    to:{
        type:SchemaTypes.ObjectId,
        required:true,
        ref:"user"
    },
    message:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

module.exports=model('chatpage',chatSchema);