const _User = require("../models/user.model");
const _Wishlist = require("../models/withList");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const sendEmail = require("../utils/sendEmail");
const {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword
} = require("../services/user.services");
module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { elements } = await registerUser({ email });

      res.status(200).json({
        message: " OTP send to your phone success",
        elements,
      });
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json(error);
    }
  },
  verifyUser: async (req, res, next) => {
    const result = await verifyUser(req.body);
    res.status(200).json({
      result,
    });
  },
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { code, message, elements } = await loginUser({ email, password });
      res.status(code).json({ message, elements });
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json(error);
    }
  },
  createWishlist: async (req, res, next) => {
    await new _Wishlist(req.body).save();
    res.status(200).send({ message: "Success" });
  },
  findWishlist: async (req, res, next) => {
    const wishlist = await _Wishlist
      .find({
        userid: "62cc291440ee8f4348e36245",
      })
      .select()
      .populate("userid", "");
    res.status(200).json({ wishlist });
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(401).json({ message: "Please enter your email address" });
      }
      const { code, resetToken, username, user } = await forgotPassword({
        email,
      });
      console.log(resetToken);
      if (code === 201) {
        const resetURL = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/resetPassword/${resetToken}`;
        try {
          await sendEmail({
            receiverEmail: email,
            UserName: username,
            website: "My anime list",
            redirectLink: resetURL,
            resetToken: resetToken,
          });
          console.log(resetToken)
          res.status(200).json({
            status: "success",
            message: "Token send to email !",
          });
        } catch (err) {
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save({ validateBeforeSave: false });
          throw new NotFoundError("There is no user with email ");
        }
    }
    } catch (error) {
      res.status(httpStatus.BAD_REQUEST).json({ error });
    }
  },
  resetPassword : async ( req, res, next ) => {
        try {
            const {token} = req.query
            const {password} = req.body
    
            const {code, message , tokenReturn , user}  = await resetPassword({tokenNotHashed : token , password});

    
            res.status(code).json({ 
                message : message , tokenReturn
            })

        } catch (error) {
            res.status(httpStatus.BAD_REQUEST).json({ error });
        }
  }
};
