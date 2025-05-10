// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sendEmail = require('./sendEmail');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// API gửi OTP
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Tạo OTP 6 chữ số
  sendEmail(email, otp); // Gửi email
  res.json({ message: 'Đã gửi OTP đến email: ', otp }); // Gửi lại otp để test
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://192.168.1.8:${PORT}`);
});
