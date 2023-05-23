const {Schema,model,SchemaTypes}=require('mongoose');

const groupChatSchema=new Schema({
    participance:{
        type:[{
                type:SchemaTypes.ObjectId, 
                ref:"user"
            }],
        required:true
    },
    group:{
        type:SchemaTypes.ObjectId,
        required:true,
        ref:"group"
    },
    message:String,
    image:String,
    location:{
        type:{
            typr:String,
            enum:["Point"],
        },
        coordinates:{
            type:[Number]
        }
    },
    send_by:{
        type:SchemaTypes.ObjectId,
        require:true,
        ref:"user"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports=model('groupChat',groupChatSchema)