const socketIo=require('socket.io');

let io;

function initialize(server){
    io=socketIo(server,{
          pingTimeout:60000,
          cors:{
            origin:"http://localhost:3000"
          }});
    io.on('connection',(socket)=>{
        console.log("socket connected",socket.id);
    })
}

function getIO(){
    if(!io){
        return new Error("Socket.io has been initilization");
    }
    return io;
}

module.exports = {initialize, getIO}