import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { get, ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const checkEmailExists = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return false;
    }

    const encodedEmail = email.replace(/\./g, '_'); // ✅ giống LoginScreen
    const userRef = ref(database, 'users/' + encodedEmail);

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

  const sendOtp = async () => {
    const isEmailValid = await checkEmailExists();
    if (!isEmailValid) return;

    // ✅ Điều hướng ngay lập tức
    navigation.navigate('XacThucOtpScreen', { email });

    try {
      const response = await fetch('http://192.168.1.8:3000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', `Mã OTP đã được gửi đến ${email}`);
        const encodedEmail = email.replace(/\./g, '_');

        await set(ref(database, `otps/${encodedEmail}`), {
          email,
          otp: data.otp,
          timestamp: Date.now(),
        });
      } else {
        Alert.alert('Lỗi', data?.error || 'Gửi OTP thất bại');
      }
    } catch (error) {
      console.error('❌ Lỗi gửi OTP:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>Nhập email đã đăng ký để nhận mã OTP</Text>

        <TextInput
          style={styles.input}
          placeholder="Email của bạn"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={sendOtp}>
          <Text style={styles.buttonText}>Gửi OTP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
