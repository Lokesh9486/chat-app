module.exports=(err,req,res,next)=>{
    let message=err.message;
    err.statusCode=err.statusCode||500;
    let error=new Error(message);
    if(err.name==="ValidationError"){
        message=Object.values(err.errors).map(val=>val.message);
        error=new Error(message);
    }
    if(err.code===11000){
        message=`${Object.keys(err.keyValue)} already exits`;
        error=new Error(message);
    }
   res.status(err.statusCode).json(error.message|| "Internal Server Error");
}