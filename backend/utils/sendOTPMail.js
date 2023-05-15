const nodemailer = require("nodemailer");
const path = require("path");
const hbs=require("nodemailer-express-handlebars");

const sendEmail = async (options) => {
  
  const transport = {
    service: "hotmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(transport);
  
  const handlebarsOptions={
    viewEngine:{
      extName:'.hbs',
      partialsDir:  path.join(__dirname,'../views'),
      defaultLayout:false,
    },
    viewPath: path.join(__dirname,'../views'),
    extName: '.hbs',
  }
  transporter.use('compile',hbs(handlebarsOptions))
  const imageURL=`${options.req.protocol}://${options.req.get("host")}/uploads/user/logo.png`
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    template:'mailTemplate',
    context:{
      otp:options.message,
      imageURL
    }
  };

  
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
