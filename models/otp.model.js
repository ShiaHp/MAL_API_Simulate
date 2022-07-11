const {Schema, model  } = require('mongoose');

const otpSchema = new Schema({
    email : String,
    otp : String,
    create :{
        type : Date,
        default : Date.now(),

    }
},
{collection : 'otp'})


otpSchema.index({ create: 1 }, { expires: '24h' })
module.exports = model('otp', otpSchema);