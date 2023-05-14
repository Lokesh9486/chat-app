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
    image:String,
    message:String,
    location:{
        type:{
            type:String,
            enum:['Point'],
        },
        coordinates:{
            type:[Number]
        }
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})

module.exports=model('chatpage',chatSchema);