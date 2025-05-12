import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = ({ goBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (email === 'abc' && password === '1') {
      goBack(); // Quay về App.js nếu đúng
    } else {
      Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {isRegister ? (
          <>
            <Text style={styles.title}>📝 Đăng ký</Text>
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry />
            <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" secureTextEntry />
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Đăng ký</Text></TouchableOpacity>

            {/* Căn ngang "Đã có tài khoản?" và nút "Đăng nhập" */}
            <View style={styles.row}>
              <Text style={styles.normalText}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => setIsRegister(false)}>
                <Text style={styles.linkText}> Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>🔑 Đăng nhập</Text>
            <TextInput style={styles.input} placeholder="Email hoặc tên đăng nhập" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />

            {/* "Nhớ tôi" + "Quên mật khẩu" ngang hàng */}
            <View style={styles.rememberRow}>
              <TouchableOpacity style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
                <Icon name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"} size={20} color="#007AFF" />
                <Text style={styles.rememberText}>Nhớ tôi</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.linkText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Căn ngang "Chưa có tài khoản?" và nút "Đăng ký" */}
            <View style={styles.row}>
              <Text style={styles.normalText}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => setIsRegister(true)}>
                <Text style={styles.linkText}> Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Nút quay lại trang chính */}
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.linkText}>🔙 Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  box: { width: '85%', backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', textAlign: 'center', marginBottom: 15 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 8, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  normalText: { fontSize: 14, color: '#000' },
  linkText: { fontSize: 14, color: '#007AFF', fontWeight: 'bold' },
  rememberRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { marginLeft: 8, fontSize: 14, color: '#333' },
  backButton: { marginTop: 15, alignItems: 'center' },
});

export default Login;
