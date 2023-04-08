const express=require("express");
const app= express();
const auth=require("./routes/auth");
const erroMiddleware=require("./middleware/error");
app.use(express.json());

app.use("/chat",auth);

app.use(erroMiddleware);

module.exports=app;