const app = require("./app");
const connection = require("./config/database");
const path=require('path');
const dotenv = require("dotenv");
const { initialize } = require("./utils/socket");
// const socket=require('socket.io');

dotenv.config({ path: path.join(__dirname, "config/config.env") });
connection();

 const server=app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});

 const io= require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000",
    credentials: true,
  }
})

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
  global.chatSocket=socket;
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId,socket.id);
    console.log(onlineUsers);
  })

  socket.on("send-message",({ currentChat, userSendMessage })=>{
    const sendUserSocket=onlineUsers.get(currentChat);
    console.log("socket.on ~ sendUserSocket:", sendUserSocket)
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-received",userSendMessage);
    }
  })
  
});

