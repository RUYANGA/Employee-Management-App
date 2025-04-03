const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'gmail',
    secure:true,
    auth:{
        user:process.env.Email,
        pass:process.env.EMAIL_PASS
    }
});

module.exports={transporter}