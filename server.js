const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // file json bạn tải từ Firebase

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lab4-8ea2b-default-rtdb.firebaseio.com' // Thay bằng URL Firebase của bạn
});

const db = admin.database();

// Route test server chạy
app.get('/', (req, res) => {
  res.send('Server đang hoạt động!');
});

// Cấu hình nodemailer với Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'laphamthanhtruc2003@gmail.com',
    pass: 'uushtpsvvwwnuqtu', // mật khẩu ứng dụng của bạn
  },
});

// Hàm lưu OTP vào Firebase với key chỉ lấy phần trước dấu @
async function saveOtpToRealtimeDb(email, otp) {
  const key = email.replace(/\./g, '_'); 
  const ref = db.ref('otps').child(key);
  const timeSent = new Date().toISOString();

  await ref.set({
    otp: otp,
    timeSent: timeSent
  });

  console.log(`✅ Đã lưu OTP cho ${key} vào Firebase lúc ${timeSent}`);
}

// app.post('/send-otp', async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email là bắt buộc' });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000);
//   const key = email.split('@')[0];
//   console.log(`🔍 OTP tạo ra cho email ${email} (key: ${key}):`, otp);

//   const mailOptions = {
//     from: 'laphamthanhtruc2003@gmail.com',
//     to: email,
//     subject: 'Mã OTP để đặt lại mật khẩu',
//     text: `Mã OTP của bạn là: ${otp}`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email đã gửi:', info.response);

//     // Lưu OTP vào Firebase
//     await saveOtpToRealtimeDb(email, otp);

//     return res.json({
//       message: 'Đã gửi OTP thành công',
//       otp: otp.toString(),
//     });
//   } catch (error) {
//     console.error('❌ Gửi email thất bại hoặc lưu OTP lỗi:', error);
//     return res.status(500).json({ error: 'Không thể gửi email hoặc lưu OTP' });
//   }
// });
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email là bắt buộc' });
  }

  const key = email.split('@')[0];
  const ref = db.ref('otps').child(key);
  const snapshot = await ref.get();

  // Nếu đã có OTP và chưa hết hạn 2 phút
  if (snapshot.exists()) {
    const otpData = snapshot.val();
    const sentTime = new Date(otpData.timeSent).getTime();
    const now = Date.now();

    if (now - sentTime < 2 * 60 * 1000) {
      return res.status(429).json({
        error: 'OTP đã được gửi. Vui lòng đợi 2 phút để gửi lại.',
      });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`📧 Yêu cầu gửi OTP từ email: ${email}`);
  console.log(`🔐 Mã OTP tạo ra: ${otp}`);

  const mailOptions = {
    from: 'laphamthanhtruc2003@gmail.com',
    to: email,
    subject: 'Mã OTP để đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email đã gửi:', info.response);

    // Lưu OTP và thời gian gửi
    await ref.set({
      otp: otp.toString(),
      timeSent: new Date().toISOString(),
    });

    return res.json({
      message: 'Đã gửi OTP thành công',
    });
  } catch (error) {
    console.error('❌ Gửi email thất bại hoặc lưu OTP lỗi:', error);
    return res.status(500).json({ error: 'Không thể gửi email hoặc lưu OTP' });
  }
});

const PORT = 3000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server đang chạy tại http://10.17.179.12:${PORT}`);
});
