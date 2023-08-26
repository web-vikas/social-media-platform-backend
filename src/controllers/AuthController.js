const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Config = require("../config/vars");
const { User } = require("../models");
const {
  IsExists,
  Insert,
  FindOne,
  Find,
  FindAndUpdate,
  Delete,
  HandleSuccess,
  HandleError,
  HandleServerError,
  Aggregate,
  ValidateEmail,
  PasswordStrength,
  ValidateAlphanumeric,
  ValidateLength,
  ValidateMobile,
  GeneratePassword,
  IsExistsOne,
} = require("./BaseController");
const saltRounds = 10;

module.exports = {
  Login: async (req, res, next) => {
    try {
      const { email = "", password = "" } = req.body;

      let validateError = null;
      if (!ValidateEmail(email.trim()))
        validateError = "Please enter a valid email id i.e abc@gmail.com";

      if (validateError) return HandleError(res, validateError);

      let isUserExists = await IsExistsOne({
        model: User,
        where: { email: email },
      });
      if (!isUserExists) {
        return HandleError(res, "User doesn't exists!");
      }

      if (isUserExists) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          isUserExists.password
        );

        if (!isPasswordCorrect) return HandleError(res, "Incorrect Password!");
      }

      let user = { ...isUserExists };

      const active_session_refresh_token = GeneratePassword();
      const access_token = jwt.sign(
        { id: user._id, email: user.email },
        Config.secret,
        {
          expiresIn: Config.tokenExpiryLimit,
        }
      );

      let updated = await FindAndUpdate({
        model: User,
        where: { _id: user._id },
        update: {
          $set: {
            access_token: access_token,
            active_session_refresh_token: active_session_refresh_token,
          },
        },
      });
      let userData = { ...updated._doc };

      if (!updated) return HandleError(res, "Failed to generate access token.");

      userData = {
        _id: user._id,
        email: user.email,
        access_token: access_token,
        active_session_refresh_token: active_session_refresh_token,
      };

      return HandleSuccess(res, userData);
    } catch (err) {
      HandleServerError(res, req, err);
    }
  },
  SignUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      let validateError = null;
      if (!ValidateEmail(email.trim()))
        validateError = "Please enter a valid email id i.e abc@gmail.com";

      if (validateError) return HandleError(res, validateError);
      const isExistEmail = await IsExistsOne({
        model: User,
        where: {
          email: email,
        },
      });
      if (isExistEmail) {
        return HandleError(res, "Email ALready Exist ..");
      }
      const password_hash = await bcrypt.hash(password, saltRounds);
      const createUser = await Insert({
        model: User,
        data: {
          name,
          email,
          password: password_hash,
        },
      });
      if (createUser) {
        return HandleSuccess(res, "User Created Successfully !");
      }
      return HandleError(res, "Failed to crete user");
    } catch (error) {
      console.log(error);
      HandleServerError(res, req, error);
    }
  },
};
