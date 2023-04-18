const sendToken = (user, statusCode, res, message) => {
  const token = user.jsonWebToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    HttpOnly: true,
  };
 return res.status(statusCode).cookie("token", token, options).json(message);
};

module.exports = sendToken;
