import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { database, ref, set } from '../firebaseConfig';
import CryptoJS from 'crypto-js';  // Import CryptoJS

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và mật khẩu xác nhận không trùng khớp');
      return;
    }

    // Mã hóa mật khẩu trước khi lưu vào Firebase với CryptoJS
    const hashedPassword = CryptoJS.MD5(password).toString(); // Sử dụng MD5 (hoặc SHA256)

    // Thêm người dùng vào Firebase Realtime Database
    const userId = email.split('@')[0];
    set(ref(database, 'users/' + userId), {
      email: email,
      password: hashedPassword,
    })
      .then(() => {
        Alert.alert('Đăng ký thành công!');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.navigate('LoginScreen');  // Điều hướng về màn hình đăng nhập
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh ở trên tiêu đề */}
      <Image 
        source={require('../assets/meo.jpg')} 
        style={styles.image}
      />
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {/* Nhập email */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      {/* Nhập mật khẩu */}
      <View style={styles.passwordContainer}>
        <Icon name="key" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#808080" />
        </TouchableOpacity>
      </View>

      {/* Nhập xác nhận mật khẩu */}
      <View style={styles.passwordContainer}>
        <Icon name="key" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#808080" />
        </TouchableOpacity>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Chuyển sang màn hình đăng nhập */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>
          Đã có tài khoản? <Text style={{ color: '#007BFF' }}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loginText: {
    marginTop: 15,
    fontSize: 14,
    color: '#333',
  },
}); 