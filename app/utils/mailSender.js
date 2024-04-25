const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS, 
    },
});

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

const MailSender = (sendMailObject) => {
    let mailOptions = {
        from: process.env.EMAIL_ID, 
        to: sendMailObject.email,
        subject: sendMailObject.subject,
        text: sendMailObject.text,
        html: sendMailObject.html
    };
    sendEmail(mailOptions);
};

module.exports = MailSender;
