const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
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

transporter.use("compile", hbs({
    viewEngine: {
        extname: ".hbs",
        defaultLayout: false
    },
    viewPath: path.join(__dirname, "..", "views", "emails"),
    extName: ".hbs"
}));

transporter.verify(function(error, success) {
    if(success) {
        // eslint-disable-next-line
        console.log("Server is ready to take our messages");
    } else {
        // eslint-disable-next-line
        console.log(error);
    }
});

module.exports = transporter;