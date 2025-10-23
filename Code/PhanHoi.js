import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { database } from '../firebaseConfig'; // Đường dẫn file config firebase của bạn
import { ref, push } from "firebase/database";

const PhanHoi = ({ route }) => {
  // Lấy email người nhận (user) từ params navigation
  const guiDenEmail = route?.params?.userEmail || '';

  const [form, setForm] = useState({
    maPhanHoi: generateMaPhanHoi(),
    tieuDe: '',
    noiDung: '',
    nguoiGui: 'admin',
    guiDen: guiDenEmail,
  });

  function generateMaPhanHoi() {
    // Tạo mã tự động: 'PH' + timestamp + 3 số ngẫu nhiên
    const randomNum = Math.floor(100 + Math.random() * 900);
    return 'PH' + Date.now() + randomNum;
  }

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSend = async () => {
    const { maPhanHoi, tieuDe, noiDung, nguoiGui, guiDen } = form;
    if (!tieuDe || !noiDung || !guiDen) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tiêu đề, nội dung và email người nhận');
      return;
    }

    try {
      const phanHoiRef = ref(database, 'PhanHoi');
      await push(phanHoiRef, {
        maPhanHoi,
        tieuDe,
        noiDung,
        nguoiGui,
        guiDen,
        ngayGui: new Date().toISOString()
      });

      Alert.alert('Thành công', 'Đã gửi phản hồi và lưu vào Firebase');

      setForm({
        maPhanHoi: generateMaPhanHoi(),
        tieuDe: '',
        noiDung: '',
        nguoiGui: 'admin',
        guiDen: guiDenEmail,
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Gửi phản hồi thất bại: ' + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Gửi Phản Hồi</Text>

      <TextInput
        style={styles.input}
        placeholder="Mã phản hồi"
        value={form.maPhanHoi}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={form.tieuDe}
        onChangeText={text => handleChange('tieuDe', text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nội dung"
        multiline
        numberOfLines={4}
        value={form.noiDung}
        onChangeText={text => handleChange('noiDung', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Người gửi"
        value={form.nguoiGui}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Gửi đến (email)"
        keyboardType="email-address"
        value={form.guiDen}
        onChangeText={text => handleChange('guiDen', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Gửi phản hồi</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PhanHoi;
