module.exports=(err,req,res,next) => {
    console.log("err:", err)
    let message=err.message;
    err.statusCode=err.statusCode||500;
    let error=new Error(message);
    if(err.name=="ValidationError"){
        message=Object.values(err.errors).map(val=>val.message);
        error=new Error(message);
        err.statusCode=400;
    }
    if(err.name=="CastError"){
        message=`Resource not found ${err.path}`;
        error=new Error(message);
        err.statusCode=400;
    }
    if(err.code==11000){
        console.log(err+"DSfsdsdfsds");
        err.statusCode=400;
        message=`${Object.keys(err.keyValue)} already exits`;
        error=new Error(message);
    }
    if(err.name == 'JSONWebTokenError') {
        let message = `JSON Web Token is invalid. Try again`;
        error = new Error(message)
        err.statusCode = 400
    }
    if(err.name == 'TokenExpiredError') {
        let message = `JSON Web Token is expired. Try again`;
        error = new Error(message)
        err.statusCode = 400
    }
   res.status(err.statusCode).json(error.message|| "Internal Server Error");
}