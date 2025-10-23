import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { database, ref, set } from '../firebaseConfig';
import CryptoJS from 'crypto-js';

export default function SignupScreen2({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Tên đăng nhập mới
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState('Chuyên gia');

  const handleSignup = () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và mật khẩu xác nhận không trùng khớp');
      return;
    }
    // Mã hóa mật khẩu
    const hashedPassword = CryptoJS.MD5(password).toString();
    // Lưu theo username (tên đăng nhập)
    set(ref(database, 'admin/' + username), {
      email: email,
      username: username,
      password: hashedPassword,
      accountType: accountType,
    })
      .then(() => {
        Alert.alert('Đăng ký thành công!');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('Chuyên gia');
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/meo.jpg')} style={styles.image} />
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Tên đăng nhập */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.passwordContainer}>
        <Icon name="key" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#808080" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <Icon name="key" size={20} color="#808080" style={styles.icon} />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#808080" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20, width: '100%', justifyContent: 'center' }}>
        {['Chuyên gia', 'Quản trị'].map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.radioContainer}
            onPress={() => setAccountType(type)}
          >
            <View style={styles.outerCircle}>
              {accountType === type && <View style={styles.innerCircle} />}
            </View>
            <Text style={{ marginLeft: 8 }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

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
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
});
