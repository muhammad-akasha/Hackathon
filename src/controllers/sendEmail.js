import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MY_EMAIL, // Your Gmail
    pass: process.env.APP_PASSWORD, // App Password
  },
});

const sendEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: '"Akasha"',
      to: email, // recipient email
      subject: "Register Succesfull TO THE ECOMMERCE WEB ✔", // Subject line
      text: "Successfully register to the ecommerce app", // Plain text body
      html: "<b>Successfully register</b>", // HTML body
    });

    return { message: `Message sent: ${info.messageId}` };
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
};
export { sendEmail };
