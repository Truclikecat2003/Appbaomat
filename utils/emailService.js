// utils/emailService.js
export const sendEmail = (email, otp) => {
  // Gửi email với mã OTP
  console.log(`Gửi email tới ${email} với mã OTP: ${otp}`);
  // Thực hiện HTTP request tới API gửi email ở đây, ví dụ:
  // fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email }] }],
  //     from: { email: 'your-email@example.com' },
  //     subject: 'Mã OTP để đặt lại mật khẩu',
  //     content: [{ type: 'text/plain', value: `Mã OTP của bạn là: ${otp}` }],
  //   }),
  // });
};
