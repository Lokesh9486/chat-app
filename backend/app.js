const express=require("express");
const app= express();
const auth=require("./routes/auth");
const erroMiddleware=require("./middleware/error");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.use("/chat",auth);

app.use(erroMiddleware);

module.exports=app;