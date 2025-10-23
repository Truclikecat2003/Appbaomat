import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';

// ✅ Import danh sách mật khẩu phổ biến từ assets
import commonPasswords from '../assets/thongdung.json';

// 🔐 Hàm sinh mật khẩu mạnh
const generateStrongPassword = (length = 12) => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  const allChars = upper + lower + numbers + special;

  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

const BaomatScreen = () => {
  const route = useRoute();
  const userEmail = route.params?.userEmail ?? '';

  const [email] = useState(userEmail);
  const [hoTen, setHoTen] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = () => {
    const pw = password.trim().toLowerCase();
    const emailLower = email.trim().toLowerCase();
    const hoTenLower = hoTen.trim().toLowerCase();

    if (!pw) {
      setErrorMsg('Vui lòng nhập mật khẩu');
      return false;
    }

    if (pw.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự');
      return false;
    }

    if (pw.includes(emailLower) || pw.includes(hoTenLower)) {
      setErrorMsg('Mật khẩu không được chứa email hoặc họ tên');
      return false;
    }

    if (commonPasswords.includes(pw)) {
      setErrorMsg('Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác');
      return false;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
      setErrorMsg('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSuggestPassword = () => {
    const newPassword = generateStrongPassword(12);
    setPassword(newPassword);
    setErrorMsg('');
  };

  const handleSubmit = () => {
    if (validatePassword()) {
      Alert.alert('Thành công', 'Mật khẩu hợp lệ');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Kiểm tra Mật khẩu</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        value={email}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={styles.label}>Họ và tên:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ tên"
        value={hoTen}
        onChangeText={setHoTen}
      />

      <Text style={styles.label}>Mật khẩu:</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeButton}>
          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.suggestButton]}
          onPress={handleSuggestPassword}
        >
          <Text style={styles.buttonText}>Đề Xuất Mật Khẩu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  eyeButton: {
    padding: 10,
  },
  eyeText: {
    fontSize: 20,
  },
  error: {
    marginTop: 10,
    color: 'red',
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  suggestButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default BaomatScreen;
