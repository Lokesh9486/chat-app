const express=require("express");
const app= express();
const auth=require("./routes/auth");
const erroMiddleware=require("./middleware/error");
const cookieParser = require("cookie-parser");
const chat=require("./routes/chat");
app.use(express.json());
app.use(cookieParser());

app.use("/chat",auth);

app.use("/chat",chat);

app.use(erroMiddleware);

module.exports=app;