
const nodeMailer = require('nodemailer'); // goi thu vien mailer
const mailConfig = require('../config/mail.config'); // goi file config thong tin mail

exports.sendMail = (to, subject, text) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD,
        }
    });

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        text: text
    }
    return transport.sendMail(options);
}