const path = require("path");
const dotenv = require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  mongodb: process.env.MONGO_CONNECTION_STRING,
  secret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV,
  tokenExpiryLimit: 3600,
  isAppSocketIOEnable: false,
};
