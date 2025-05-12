 
// sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'laphamthanhtruc2003@gmail.com',
    pass: 'rjph xhsp fqnn hmkl', // đúng là "App Password"
  },
});

const sendEmail = (email, otp) => {
  const mailOptions = {
    from: 'laphamthanhtruc2003@gmail.com',
    to: email,
    subject: 'Mã OTP để đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Gửi mail thất bại:', error);
    } else {
      console.log('✅ Email đã gửi:', info.response);
    }
  });
};

module.exports = sendEmail;
