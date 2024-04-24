const nodemailer = require("nodemailer");

const MailSender = (sendMailObject) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: "Email Id",
        to: sendMailObject.email,
        subject: sendMailObject.subject,
        text: sendMailObject.text,
        html: sendMailObject.html
    };
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            throw res.status(400).send({ error, message: "Failed to send OTP" });
        }
    })
}

module.exports = MailSender;
