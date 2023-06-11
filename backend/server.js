const app = require("./app");
const connection = require("./config/database");
const path=require('path');
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config/config.env") });
connection();

const server=app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});

const io= require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000"
  }
})

io.on("connection",(socket)=>{
  console.log("connection to socket: " + socket.toString());
  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    consoel.log(userData);
    socket.emit("connection")
  });
})