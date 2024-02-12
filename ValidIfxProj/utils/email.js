// utils/email.js
const nodemailer = require('nodemailer');

async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abrahim.webpaint@gmail.com', // Your Gmail email address
        pass: 'zuodbwacfgnthsdc' // Your Gmail password or app-specific password
      }
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'your-email@gmail.com', // Sender address
      to: email, // List of receivers
      subject: subject, // Subject line
      text: text // Plain text body
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = sendEmail;
