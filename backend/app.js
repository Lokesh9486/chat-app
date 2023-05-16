const express = require("express");
const app = express();
const auth = require("./routes/auth");
const erroMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const chat = require("./routes/chat");
app.use(express.json());
const multer = require("multer");
const bodyParser=require("body-parser")
const path = require("path");
app.use(cookieParser());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/chat", auth);

app.use("/chat", chat);

// app.use(express.static(path.join(__dirname,'../frontend/build')));
// app.get("*",(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'));
// })

app.use(erroMiddleware);

module.exports = app;
