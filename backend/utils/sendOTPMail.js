const nodemailer = require("nodemailer");
const path = require("path");
const hbs=require("nodemailer-express-handlebars");
const fs = require('fs');

const sendEmail = async (options) => {
  
  // const transport = {
  //   service: "hotmail",
  //   auth: {
  //     user: process.env.FROM_EMAIL,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // };

  // const transporter = nodemailer.createTransport(transport);
  
  // const handlebarsOptions={
  //   viewEngine:{
  //     extName:'.hbs',
  //     partialsDir:  path.join(__dirname,'../views'),
  //     defaultLayout:false,
  //   },
  //   viewPath: path.join(__dirname,'../views'),
  //   extName: '.hbs',
  // }

  // transporter.use('compile',hbs(handlebarsOptions))

  // const imageURL=`${options.req.protocol}://${options.req.get("host")}/uploads/user/logo.png`

  // const mailOptions = {
  //   from: process.env.FROM_EMAIL,
  //   to: options.email,
  //   subject: options.subject,
  //   template:'mailTemplate',
  //   context:{
  //     otp:options.message,
  //     imageURL
  //   }
  // };

  
  // await transporter.sendMail(mailOptions);


  // const transport = {
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // };
  // const transporter = nodemailer.createTransport(transport);
  // const message={
  //   from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
  //   to:options.email,
  //   subject:options.subject,
  //   text:options.message
  // }
  
  // await transporter.sendMail(message);
// Read the email template file
const emailTemplatePath = path.join(__dirname, 'views', 'mailTemplate.hbs');
const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

// Compile the template
const emailTemplate = handlebars.compile(emailTemplateSource);
  
  const transport = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
  const transporter = nodemailer.createTransport(transport);
  const imageURL=`${options.req.protocol}://${options.req.get("host")}/uploads/user/logo.png`
    const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    // template:'mailTemplate',
    // context:{
    //   otp:options.message,
    //   imageURL
    // }
    html: emailTemplate({
        otp:options.message,
        imageURL
      })
  };

  
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
