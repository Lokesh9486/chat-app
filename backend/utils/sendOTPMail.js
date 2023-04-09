const nodemailer = require("nodemailer");
const ErrorHandler = require("./errorHandler");

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
    subject: "sending email with node.js",
    html:`<h1>${options.generateOTP}</h1>`,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return next(new ErrorHandler(err, 404));
    } else {
      options.res.status(200).write(` OTP sended to ${options.email}`);
      return options.res.end();
    }
  });
};

module.exports = sendEmail;
