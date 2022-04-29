require("dotenv").config();   //For use .env file
const nodemailer = require("nodemailer");

const sendEmail = async (name, email, message) => {
    var name = name;
    var email = email;
    var message = message;

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: 'iamishika1441@gmail.com',
                pass: 'thwwajpvnyehzjsn',
            },
        });

        await transporter.sendMail({
          from: `${email}`,
          to: 'iamishika1441@gmail.com' ,
          html: `<hr/> You got a message from <hr/>
          Email : ${email} <hr/>
          Name: ${name} <hr/>
          Message: ${message} <hr/>`,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

 const contactMe = async (req, res, next) => {

    const { name, email, message } = req.body;

    try {
      await sendEmail(name, email, message);
      res.status(200).send("Message Successfully Sent!");
    } catch (error) {
      res.status(400).send("Message Could not be Sent");
    }
  };

module.exports = {sendEmail,contactMe};