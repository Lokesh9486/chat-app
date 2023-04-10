const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transport = {
    service: "hotmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    html:options.message,
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
