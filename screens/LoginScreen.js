import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { database, ref, get } from '../firebaseConfig';  
import CryptoJS from 'crypto-js';  

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const userId = email.split('@')[0]; // Dùng email làm ID

    // Lấy dữ liệu người dùng từ Firebase
    const userRef = ref(database, 'users/' + userId);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const hashedPassword = CryptoJS.MD5(password).toString(); // Mã hóa mật khẩu nhập vào

          if (hashedPassword === userData.password) {
            Alert.alert('Đăng nhập thành công!');
            setEmail('');
            setPassword('');
            navigation.navigate('HomeScreen');  // Chuyển sang màn hình chính
          } else {
            Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng');
          }
        } else {
          Alert.alert('Lỗi', 'Email không tồn tại trong hệ thống');
        }
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập');
        console.error(error);
      });
  };

  // Ẩn mũi tên quay lại ở header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,  
      title: 'Login',// Ẩn mũi tên back
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Hình ảnh ở trên tiêu đề */}
      <Image 
        source={require('../assets/meo.jpg')}
        style={styles.image}
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>Đăng nhập</Text>

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
      <View style={styles.inputContainer}>
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

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Chuyển sang màn hình đăng ký */}
      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.loginText}>
          Chưa có tài khoản? <Text style={{ color: '#007BFF' }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>

      {/* Chuyển sang màn hình quên mật khẩu */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.loginText}>
          <Text style={{ color: '#007BFF' }}> Quên mật khẩu?</Text>
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