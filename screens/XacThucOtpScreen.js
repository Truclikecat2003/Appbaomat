import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database, ref, get, set } from '../firebaseConfig';
import CryptoJS from 'crypto-js'; // Thêm dòng này để dùng mã hóa MD5

const XacThucOtpScreen = ({ route, navigation }) => {
  const { userId, email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOtpVerification = () => {
    const otpRef = ref(database, 'otps/' + userId);
    get(otpRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const savedOtp = snapshot.val().otp;
          const sanitizedSavedOtp = String(savedOtp).trim();
          const sanitizedOtp = otp.trim();

          if (sanitizedSavedOtp === sanitizedOtp) {
            const userRef = ref(database, 'users/' + userId);

            // Mã hóa mật khẩu mới
            const hashedPassword = CryptoJS.MD5(newPassword).toString();

            // Lấy dữ liệu người dùng hiện tại (để không ghi đè)
            get(userRef)
              .then((userSnapshot) => {
                if (userSnapshot.exists()) {
                  const userData = userSnapshot.val();
                  const updatedUserData = {
                    ...userData,
                    password: hashedPassword,
                  };

                  set(userRef, updatedUserData)
                    .then(() => {
                      Alert.alert('Thành công', 'Mật khẩu đã được cập nhật');
                      navigation.goBack();
                    })
                    .catch((error) => {
                      console.error('Lỗi cập nhật mật khẩu:', error);
                      Alert.alert('Lỗi', 'Không thể cập nhật mật khẩu');
                    });
                } else {
                  Alert.alert('Lỗi', 'Không tìm thấy người dùng');
                }
              })
              .catch((error) => {
                console.error('Lỗi lấy người dùng:', error);
                Alert.alert('Lỗi', 'Không thể truy xuất thông tin người dùng');
              });
          } else {
            Alert.alert('Lỗi', 'Mã OTP không đúng');
          }
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy mã OTP');
        }
      })
      .catch((error) => {
        console.error('Lỗi kiểm tra OTP:', error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra OTP');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác Thực OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
        <Text style={styles.buttonText}>Xác thực và cập nhật mật khẩu</Text>
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
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
});

export default XacThucOtpScreen;
