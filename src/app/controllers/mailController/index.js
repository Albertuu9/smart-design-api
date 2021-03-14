const nodemailer = require('nodemailer');

require('dotenv').config();
// email sender function
function sendMail(user, mail, res){

// Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        //host: 'myhost',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        },
    });
// Definimos el email
const mailOptions = {
    from: 'Smartdesign',
    // to: process.env.MAIL_TEST ? process.env.MAIL_TEST : user.email,
    to: user.email,
    subject: mail.subject,
    html: mail.body
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        res.json({'code':500})
    } else {
        res.json({'code':200})
    }
});
};

module.exports = { sendMail }