const _User = require("../models/user.model");
const _Wishlist = require("../models/withList");
const _OTP = require("../models/otp.model");
const apiError = require("../utils/ApiError");
const otpGenerator = require("otp-generator");
const httpStatus = require("http-status");
const { insertOtp, validOtp } = require("./otp.services");
const { sendTextMessage } = require("../utils/SendSMS");
const crypto = require("crypto");

module.exports = {
  findAllWishlist: async ({ id }) => {
    try {
      const wishlistFound = await _Wishlist.find({ userid : id}).populate("wishAnime");
      return {
        code  :201,
        message : 'Success ',
        elements : wishlistFound
      }
    } catch (e) {
      return {
        code  :401,
        message : e.message,
        elements : 0
      }
    }
  },
  createWishlist: async (info) => {
    try {
      const newWishlist = await new _Wishlist({
        userid: info.userid,
        wishAnime: info.wishAnime,
        score: info.score,
        status: info.status,
      }).save();

      return {
        code: 200,
        message: " Success",
        elements: newWishlist,
      };
    } catch (error) {
      return {
        code: 401,
        message: e.message,
        elements: 0,
      };
    }
  },
  registerUser: async ({ email }) => {
    if (await _User.isEmailTaken(email)) {
      throw new apiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    sendTextMessage(OTP);

    return {
      elements: await insertOtp({
        email: email,
        otp: OTP,
      }),
    };
  },
  verifyUser: async (userBody) => {
    try {
      const { email, otp, lastName, firstName, password } = userBody;

      if (await _User.isEmailTaken(email)) {
        throw new apiError(httpStatus.BAD_REQUEST, "Email already taken");
      }
      const otpHolder = await _OTP.find({ email: email });

      if (!otpHolder.length) {
        return {
          code: 404,
          message: "Expired OTP",
        };
      }

      const lastOtp = otpHolder[otpHolder.length - 1];

      const isValid = await validOtp({
        otp: otp,
        hashOtp: lastOtp.otp,
      });

      if (!isValid) {
        return {
          code: 401,
          message: "Invalid OTP",
        };
      }

      if (isValid) {
        const user = await _User.create({
          email,
          lastName,
          firstName,
          password,
        });
        const token = user.createJWT(user._id);
        if (user) {
          await _OTP.deleteMany({ email: email });
        }
        return {
          code: 201,
          message: "Create User successfully",
          elements: { user, token },
        };
      } else {
        console.log("Error creating user");
      }
    } catch (error) {
      console.error(error);
    }
  },
  loginUser: async ({ email, password }) => {
    try {
      const user = await _User.findOne({ email: email }).select("+password");

      if (!user) {
        return {
          code: 401,
          message: "Invalid email address",
        };
      }

      const isPassword = await user.comparePassword(password);
      if (!isPassword) {
        return {
          code: 401,
          message: "Invalid Credentials",
        };
      }
      const token = await user.createJWT();
      return {
        code: 201,
        message: "Login successful",
        elements: {
          user,
          token,
        },
      };
    } catch (error) {
      res.status(501).send({ message: error.message });
    }
  },
  forgotPassword: async ({ email }) => {
    try {
      const user = await _User.findOne({ email: email });

      if (!user) {
        return {
          code: 401,
          message: "There is no user with email",
        };
      }
      const username = `${user.firstName} ${user.lastName}`;
      const resetToken = user.createPasswordResetToken();
      await user.save({
        passwordResetToken: resetToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000,
      });

      return {
        code: 201,
        resetToken,
        username,
        user,
      };
    } catch (error) {
      console.log(error);
    }
  },
  resetPassword: async ({ tokenNotHashed, password }) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(tokenNotHashed)
      .digest("hex");

    const user = await _User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return {
        code: 501,
        message: "Invalid token",
      };
    }
    const tokenReturn = user.createJWT();

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return {
      code: 201,
      user,
      tokenReturn,
      message: "Your password has been reset.",
    };
  },
};
