// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
// import { database, ref, get } from '../firebaseConfig';  // Lấy dữ liệu từ Firebase
// import CryptoJS from 'crypto-js';  // Để mã hóa mật khẩu (nếu cần)
// import { getDatabase, set } from 'firebase/database';  // Đảm bảo import 'set'

// // Giả định bạn sử dụng một API gửi email (ví dụ, SendGrid hoặc Mailgun)
// const sendEmail = (email, otp) => {
//   // API giả định để gửi email, bạn cần thay thế với API thực tế như SendGrid hoặc Mailgun
//   console.log(`Gửi email tới ${email} với mã OTP: ${otp}`);
//   // Thực hiện HTTP request tới API gửi email ở đây
// };

// const ForgotPasswordScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');

// const handlePasswordReset = () => {
//   const userId = email.split('@')[0]; // Dùng email làm ID

//   // Lấy dữ liệu người dùng từ Firebase
//   const userRef = ref(database, 'users/' + userId);
//   get(userRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         // Nếu email tồn tại, tạo mã OTP
//         fetch('http://192.168.1.8:3000/send-otp', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email }) // Gửi email, không gửi mã OTP, để server tạo mã OTP
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             const otp = data.otp;  // Sử dụng mã OTP từ server

//             console.log('Server response:', data);  // Log mã OTP từ server

//             // Gửi thông báo tới người dùng
//             Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn');

//             // Lưu OTP vào Firebase (tạo cột OTP cho mỗi người dùng)
//             const otpRef = ref(database, 'otps/' + userId);  // Tạo reference tới vị trí lưu OTP của người dùng
//             set(otpRef, {
//               otp,  // Lưu mã OTP từ server
//               time: Date.now(),  // Lưu thời gian OTP được tạo
//             }).then(() => {
//               console.log('OTP đã được lưu vào Firebase:', otp); // Log mã OTP vừa được lưu
//             }).catch((error) => {
//               console.error('Lỗi lưu OTP vào Firebase:', error);
//             });
//           })
//           .catch((err) => {
//             console.error('Lỗi gửi OTP qua API:', err);
//             Alert.alert('Lỗi', 'Không thể gửi OTP qua API');
//           });
//       } else {
//         Alert.alert('Lỗi', 'Email không tồn tại trong hệ thống');
//       }
//     })
//     .catch((error) => {
//       Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra email');
//       console.error(error);
//     });
// };

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => null,  
//       title: 'Quên mật khẩu?', // Ẩn mũi tên back
//     });
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password</Text>

//       {/* Ô nhập email với icon */}
//       <View style={styles.inputContainer}>
//         <Icon name="envelope" size={20} color="#808080" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Nhập email của bạn"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       {/* Nút đặt lại mật khẩu */}
//       <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
//         <Text style={styles.buttonText}>Reset Password</Text>
//       </TouchableOpacity>

//       {/* Nút quay lại trang đăng nhập */}
//       <TouchableOpacity
//         style={styles.goBackButton}
//         onPress={() => navigation.goBack()} // Điều hướng quay lại màn hình trước (LoginScreen)
//       >
//         <Text style={styles.goBackText}>Go back to Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { database, ref, get } from '../firebaseConfig';  // Lấy dữ liệu từ Firebase
import { getDatabase, set } from 'firebase/database';  // Đảm bảo import 'set'

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    const userId = email.split('@')[0]; // Dùng email làm ID

    // Lấy dữ liệu người dùng từ Firebase
    const userRef = ref(database, 'users/' + userId);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Nếu email tồn tại, tạo mã OTP
          fetch('http://192.168.1.8:3000/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }) // Gửi email, không gửi mã OTP, để server tạo mã OTP
          })
            .then((res) => res.json())
            .then((data) => {
              const otp = data.otp;  // Sử dụng mã OTP từ server

              console.log('Server response:', data);  // Log mã OTP từ server

              // Gửi thông báo tới người dùng
              Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn');

              // Lưu OTP vào Firebase (tạo cột OTP cho mỗi người dùng)
              const otpRef = ref(database, 'otps/' + userId);  // Tạo reference tới vị trí lưu OTP của người dùng
              set(otpRef, {
                otp,  // Lưu mã OTP từ server
                time: Date.now(),  // Lưu thời gian OTP được tạo
              }).then(() => {
                console.log('OTP đã được lưu vào Firebase:', otp); // Log mã OTP vừa được lưu

                // Điều hướng đến màn hình XacThucOtpScreen và truyền email và userId
                navigation.navigate('XacThucOtpScreen', { userId, email });
              }).catch((error) => {
                console.error('Lỗi lưu OTP vào Firebase:', error);
              });
            })
            .catch((err) => {
              console.error('Lỗi gửi OTP qua API:', err);
              Alert.alert('Lỗi', 'Không thể gửi OTP qua API');
            });
        } else {
          Alert.alert('Lỗi', 'Email không tồn tại trong hệ thống');
        }
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra email');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {/* Ô nhập email với icon */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#808080" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Nút đặt lại mật khẩu */}
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Nút quay lại trang đăng nhập */}
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()} // Điều hướng quay lại màn hình trước (LoginScreen)
      >
        <Text style={styles.goBackText}>Go back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10, 
  },
  input: {
    flex: 1, 
    padding: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  goBackButton: {
    marginTop: 20,
  },
  goBackText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
