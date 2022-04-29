require("dotenv").config();   //For use .env file
const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
    var email = email;
    var token = token;

    // console.log(email)
    // console.log(token)

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'cycologydevteam@gmail.com',
                pass: 'wwczgsfnmwcjxcye',
            },
        });

        await transporter.sendMail({
            from: 'cycologydevteam@gmail.com',
            to: email,
            subject: `Reset Password Link Of Cycology`,
            html: `<p>You requested for reset password, kindly use this <a href="http://qa.cyclologyindia.com/update-password?token=' + token + '">link</a> to reset your password</p></br>DON't SAHRE IT WITH ANYONE!`
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
