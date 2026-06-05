const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

const authResponse = (user, token) => ({
  token,
  user: user.toJSON ? user.toJSON() : user,
});

module.exports = { signToken, authResponse };
