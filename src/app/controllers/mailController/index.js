const nodemailer = require('nodemailer');
const mailTemplate = require('./../../templates/mail/index')
// email sender function
function sendMail(user, code, res){
// Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'agf.smartdesign@gmail.com',
            pass: 'Oviedo2020'
        }
    });
// Definimos el email
const mailOptions = {
    from: 'Smartdesing',
    to: user.email,
    subject: 'Código de verificación',
    html: mailTemplate.sendCodeTemplate(code)
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