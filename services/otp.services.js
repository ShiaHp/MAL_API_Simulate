const catchAsync = require('../utils/catchAsync');
const _Otp = require('../models/otp.model');
const bcrypt = require("bcryptjs");
module.exports =  {

    insertOtp : async({email , otp}) =>{
        try {
            const salt = await  bcrypt.genSalt(10);
            const hashOtp = await bcrypt.hash(otp,salt);
            const Otp = await _Otp.create({
                    email : email,
                    otp : hashOtp
            })
            return Otp ? 1 : 0
        } catch (error) {
            console.error(error)
        }
    },
    validOtp : async({otp,hashOtp}) =>{
        const isValid = await bcrypt.compareSync(otp,hashOtp)
        if(isValid){
            return isValid
        }
    }
}

