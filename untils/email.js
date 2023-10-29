const nodemailer = require("nodemailer");
require("dotenv").config();
//hàm gưi email
const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "465",
      secure: true,
      auth: {
        user: "thaitqph27970@fpt.edu.vn",
        pass: "chghqoctqltokfwh",
      },
    });

    await transporter.sendMail({
      from: "thaitqph27970@fpt.edu.vn",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("email not sent successfully");
    console.log(error);
  }
};
module.exports = sendEmail;
