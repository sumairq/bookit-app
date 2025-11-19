const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(process.env.EMAIL_HOST);
  console.log(process.env.EMAIL_USERNAME);
  console.log(process.env.EMAIL_PASSWORD);
  console.log(process.env.EMAIL_PORT);

  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Sumair Qaisar <sumair@mailer.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 3) Actually send the email
  transporter.verify(function (error, success) {
    if (error) {
      console.log('Connection error:', error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
