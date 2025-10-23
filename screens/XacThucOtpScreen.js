import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ref, get, update } from 'firebase/database';
import { database } from '../firebaseConfig';
import MD5 from 'crypto-js/md5';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function XacThucOtpScreen() {
  const route = useRoute();
  const email = route.params?.email || '';
  const navigation = useNavigation();

  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmOtp = async () => {
    if (!otpInput || !newPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập OTP và mật khẩu mới');
      return;
    }

    setLoading(true);
    try {
      const key = email.split('@')[0];
      const key2 = email.replace(/\./g, '_');
      const otpRef = ref(database, `otps/${key}`);
      const snapshot = await get(otpRef);

      if (!snapshot.exists()) {
        Alert.alert('Lỗi', 'Không tìm thấy OTP cho email này');
        setLoading(false);
        return;
      }

      const otpData = snapshot.val();

      const sentTime = new Date(otpData.timeSent).getTime();
      const now = Date.now();
      const isExpired = now - sentTime > 2 * 60 * 1000;

      if (isExpired) {
        Alert.alert('Lỗi', 'OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
        setLoading(false);
        return;
      }

      if (otpData.otp !== otpInput) {
        Alert.alert('Lỗi', 'OTP không đúng.');
        setLoading(false);
        return;
      }
      // // Đọc OTP bằng key đơn giản
      // const otpRef = ref(database, `otps/${key}`);
      // const snapshot = await get(otpRef);

      // Sau khi xác thực OTP xong thì:
      const hashedPassword = MD5(newPassword).toString();
      const userRef = ref(database, `users/${key2}`); // ✅ Dùng key2
      await update(userRef, { password: hashedPassword });


      // const hashedPassword = MD5(newPassword).toString();
      // const userRef = ref(database, `users/${key}`);
      // await update(userRef, { password: hashedPassword });

      Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoginScreen', { userEmail: email }),
        }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Xác thực OTP</Text>
        <Text style={styles.sub}>Vui lòng nhập mã OTP và mật khẩu mới</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Mã OTP</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={otpInput}
          onChangeText={setOtpInput}
          placeholder="Nhập mã OTP"
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nhập mật khẩu mới"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleConfirmOtp}>
            <Text style={styles.buttonText}>Xác thực & Đổi mật khẩu</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eff3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
