const {Schema,SchemaType, model}=require("mongoose");

const group=new Schema({
    name:{
        type:String,
        require:true
    },
    description:String,
    // created_by:{
    //     type:SchemaType.ObjectId,
    //     require:true
    // },
    // participance:{
    //     type:[{
    //         type:SchemaType.ObjectId,
    //         ref:"user"
    //     }],
    //     validate:[participatelimit,' exceeds the limit of 10']
    // }
});

function participatelimit(val){
    return val.length<=10
}

module.exports=model("group",group);