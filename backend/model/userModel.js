const { Schema, model } = require("mongoose");
const bcrypt=require("bcrypt");

const schema=new Schema({
    name:{
        type:String,
        required:[true,"Please enter name"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please enter password'],
        unique:true,
        select:false,
    },
})

schema.pre("save",async function(){
    if(!this.modifiedPaths('password')){
        return next();        
    }
    this.password=await bcrypt.hash(this.password,10)
})

const userschema=model('user',schema);

module.exports=userschema;