const MessagingResponse = require('twilio').twiml.MessagingResponse;


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

 module.exports = {
    sendTextMessage : async(otp) =>{;
        client.messages
        .create({
           body: `Your OTP : ${otp}`,
           from: '+12055462683',
           to: '+84 827 025 246'
         })
        .then(message => console.log(message.sid)).catch((err) => console.error(err))
    }
   
}
 


