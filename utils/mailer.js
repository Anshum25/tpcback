const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'anshum25506@gmail.com',
    pass: process.env.MAIL_PASS, // should be set in env
  },
});

async function sendOTPEmail(otp) {
  const mailOptions = {
    from: 'Turning Point Community',
    to: 'official.turningpointcommunity@gmail.com', // fixed receiver
    subject: 'Your OTP for Admin Password Change',
    text: `Your OTP for admin password change is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOTPEmail,
};
