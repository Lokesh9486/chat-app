const {Schema,model,SchemaTypes}=require('mongoose');

const groupChatSchema=new Schema({
    participant:{
        type:[SchemaTypes.ObjectId],
        required:true,
        ref:"user"
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
    // created_by:{
    //     type:Date,
    //     default:Date.now
    // }
});

module.exports=model('groupChat',groupChatSchema)