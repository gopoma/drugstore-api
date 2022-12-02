const nodemailer = require("nodemailer");
const {
    emailHost,
    emailPort,
    emailSecure,
    emailUser,
    emailPassword
} = require("../config");

const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    auth: {
        user: emailUser,
        pass: emailPassword
    }
});

async function sendEmail(to, subject, text, html) {
    const info = await transporter.sendMail({
        from: "GustavoEdu10111213@gmail.com",
        to,
        subject,
        text,
        html
    });

    console.log(info);
    return {success:true};
}

transporter.verify(function(error, success) {
    if(success) {
        // eslint-disable-next-line
        console.log("Server is ready to take our messages");
    } else {
        // eslint-disable-next-line
        console.log(error);
    }
});

module.exports = sendEmail;