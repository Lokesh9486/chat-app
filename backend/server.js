const app = require("./app");
const connection = require("./config/database");
const path=require('path');
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "config/config.env") });
connection();

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
