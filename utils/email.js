// utils/email.js
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const template = path.join(__dirname, './emailTemplate.ejs'); // Modify this line
// Read the EJS template file synchronously
const emailTemplatePath = fs.readFileSync(template, 'utf-8');

const contactustemplate = path.join(__dirname, './contactusTemplate.ejs'); // Modify this line
// Read the EJS template file synchronously
const contactusTemplatePath = fs.readFileSync(contactustemplate, 'utf-8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abrahim.webpaint@gmail.com', // Your Gmail email address
    pass: 'zuodbwacfgnthsdc' // Your Gmail password or app-specific password
  }
});

async function sendEmail(email, subject, code) {
  try {
    const emailTemplate = await ejs.render(emailTemplatePath, { code });
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'no-reply@gmail.com', // Sender address
      to: email, // List of receivers
      subject: subject, // Subject line
      html: emailTemplate // Plain text body
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function sendContactUsEmail(subject,email,phoneNumber,description) {
  try {
    const contactUsEmailTemplate = await ejs.render(contactusTemplatePath, {description, phoneNumber, });
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: email, // Sender address
      to: "abrahim.webpaint@gmail.com", // List of receivers
      subject: subject, // Subject line
      html: contactUsEmailTemplate // Plain text body
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = {sendEmail,sendContactUsEmail};
