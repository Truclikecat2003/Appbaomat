// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendEmail = require('./sendEmail');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email là bắt buộc' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Random 6 số
  console.log("🔍 OTP tạo ra:", otp); // Kiểm tra xem OTP có giá trị hay không

  sendEmail(email, otp); // Gửi mail

  res.json({
    message: "Đã gửi OTP thành công",
    otp: String(otp) // Đảm bảo phản hồi có OTP
  });
});


app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server đang chạy tại http://192.168.32.7:3000');
});
