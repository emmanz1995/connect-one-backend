const AuthorizationError = require("../errors/authenticationError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../src/mongo/users/userModel");

const requireLogin = async (req, res, next) => {
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodedJwt = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decodedJwt.id).select({
          password: 0,
          __v: 0,
        });
        next();
      }
    } catch (err) {
      throw new AuthorizationError("Not authorized!");
    }
  } else {
    throw new AuthorizationError("Not authorized!");
  }
};

module.exports = requireLogin;
