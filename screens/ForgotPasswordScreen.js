import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { get, ref, set } from 'firebase/database';  // Thêm 'set' để lưu dữ liệu vào Firebase
import { database } from '../firebaseConfig';  

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  // Hàm kiểm tra email tồn tại trong Firebase
  const checkEmailExists = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return false;
    }

    const userId = email.split('@')[0];  
    const userRef = ref(database, 'users/' + userId);  

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return true;
      } else {
        Alert.alert('Lỗi', 'Email không tồn tại trong hệ thống');
        return false;
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra email:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kiểm tra email.');
      return false;
    }
  };

  // Hàm gửi OTP khi email hợp lệ và lưu vào Firebase
  const sendOtp = async () => {
    const isEmailValid = await checkEmailExists();
    if (!isEmailValid) return;

    try {
      const response = await fetch('http://192.168.32.7:3000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('🔍 Phản hồi từ server:', JSON.stringify(data, null, 2));
        console.log('Mã OTP đã gửi:', data.otp);

        Alert.alert('Thành công', `Mã OTP đã được gửi đến ${email}`);

        // 🔹 Lưu OTP vào Firebase
        const userId = email.split('@')[0];
        set(ref(database, `otps/${userId}`), {
          email,
          otp: data.otp,
          timestamp: Date.now(),
        });

        navigation.navigate('XacThucOtpScreen'); // Chuyển sang màn hình xác thực OTP
      } else {
        Alert.alert('Lỗi', data?.error || 'Gửi OTP thất bại');
      }
    } catch (error) {
      console.error('❌ Lỗi gửi OTP:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập email của bạn:</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={styles.button} onPress={sendOtp}>
        <Text style={styles.buttonText}>Gửi OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
