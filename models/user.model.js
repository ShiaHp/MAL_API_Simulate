const { Schema, model } = require("mongoose");
const jwt = require('jsonwebtoken');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, " First name is required"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, " Last name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          "Password must contain at least one letter and one number"
        );
      }
    },
    select: false,
  },
  passwordResetToken : String,
  passwordResetExpires : Date
});





userSchema.virtual('wishlists', {
    ref: 'Wishlists',
    localField: '_id',
    foreignField: 'userid'
  }, {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  });


  userSchema.methods.createJWT = function () {
    return jwt.sign({userId : this._id},process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME})
};







userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken =
   crypto.createHash('sha256')
   .update(resetToken)
   .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

  return resetToken;
}





// * Check if email is taken

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.comparePassword = async function(candidatePassword){

  const isMatch = await bcrypt.compare(candidatePassword,this.password);
  return isMatch

}

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;
