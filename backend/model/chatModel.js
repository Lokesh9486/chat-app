const {Schema,model,SchemaTypes}=require('mongoose');

const chatSchema=new Schema({
    from:{
        type:SchemaTypes.ObjectId,
        required:true
    },
    to:{
        type:SchemaTypes.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports=model('chatpage',chatSchema);