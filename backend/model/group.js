const {Schema, model, SchemaTypes}=require("mongoose");

const group=new Schema({
    name:{
        type:String,
        require:true
    },
    description:String,
    profile:String,
    created_by:{
        type:SchemaTypes.ObjectId,
        require:true
    },
    participance:{
        type:[{
            type:SchemaTypes.ObjectId,
            ref:"user"
        }],
        validate:[participatelimit,' exceeds the limit of 10']
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

function participatelimit(val){
    return val.length<=10
}

module.exports=model("group",group);