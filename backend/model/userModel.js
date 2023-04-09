const { Schema, model } = require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

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
    OTP:Number,
    OTPExpires:Date,
    OTPVerifed:Boolean
})

schema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
    }
     next();        
})

schema.methods.jsonWebToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECERT,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

schema.methods.isValidPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const userschema=model('user',schema);

module.exports=userschema;