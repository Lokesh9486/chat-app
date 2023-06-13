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
  console.log("connection to socket: " + socket);
  socket.on("setup",(userData)=>{
    socket.join(userData.user._id);
    console.log(userData.user._id);
    // socket.emit("connection");
  });

  socket.on("join room",(room)=>{
    socket.join(room);
    console.log("user joined room: " + room)
  });

  // socket.on("new message",(newMessage)=>{
  //   let chat =newMessage.chat;
  //   if(chat.users)return console.log("chat user not found");
  //   chat.users.forEach(user=>{
  //     if(user._id==newMessage.sender.id)return;
  //     socket.in(user._id).emit("message",newMessage)
  //   })
  // });
  socket.on("new message",data => {
    console.log("io.on ~ data:", data)
  })

})