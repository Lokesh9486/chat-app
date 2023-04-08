const mongoose=require("mongoose");

const connection=()=>{
    mongoose.connect(process.env.CONNECTION_STRING).then((con)=>{
        console.log(`Database connection string ${con.connection.host}`);
    })
}

module.exports= connection;