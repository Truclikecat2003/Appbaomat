// // sendEmail.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'laphamthanhtruc2003@gmail.com',
//     pass: 'rjph xhsp fqnn hmkl', // App Password
//   },
// });

// const sendEmail = (email, otp) => {
//   const mailOptions = {
//     from: 'laphamthanhtruc2003@gmail.com',
//     to: email,
//     subject: 'Mã OTP để đặt lại mật khẩu',
//     text: `Mã OTP của bạn là: ${otp}`,
//   };

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return reject(error);
//       } else {
//         return resolve(info.response);
//       }
//     });
//   });
// };

// module.exports = sendEmail;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'laphamthanhtruc2003@gmail.com',
    pass: 'uushtpsvvwwnuqtu',  
  },
});

const sendEmail = (email, otp) => {
  const mailOptions = {
    from: 'laphamthanhtruc2003@gmail.com',
    to: email,
    subject: 'Mã OTP để đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

module.exports = sendEmail;
