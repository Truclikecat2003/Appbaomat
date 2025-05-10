const nodemailer = require('nodemailer');

// Tạo transporter để kết nối với Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Sử dụng dịch vụ Gmail
  auth: {
    user: 'laphamthanhtruc2003@gmail.com',  // Địa chỉ email Gmail của bạn
    pass: 'rjph xhsp fqnn hmkl',     // Mật khẩu ứng dụng mà bạn vừa tạo
  },
});

// Hàm gửi email với mã OTP
const sendEmail = (email, otp) => {
  const mailOptions = {
    from: 'laphamthanhtruc2003@gmail.com',   // Địa chỉ email của bạn
    to: email,                      // Email người nhận
    subject: 'Mã OTP để đặt lại mật khẩu',  // Tiêu đề email
    text: `Mã OTP của bạn là: ${otp}`,  // Nội dung email
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Lỗi khi gửi email: ', error); // In lỗi nếu có
    } else {
      console.log('Email đã được gửi: ' + info.response); // In ra phản hồi nếu gửi thành công
    }
  });
};

module.exports = sendEmail;  // Export hàm gửi email để sử dụng ở nơi khác
