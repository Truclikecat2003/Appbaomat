import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity,
} from 'react-native';
import { database } from '../firebaseConfig';
import { ref, push, set, onValue } from 'firebase/database';

const QuanlyScreen = () => {
  const [stt, setStt] = useState(1);
  const [title, setTitle] = useState('');
  const [emailGui, setEmailGui] = useState('');
  const [noiDungEmail, setNoiDungEmail] = useState('');
  const [ketQuaTraLoi, setKetQuaTraLoi] = useState(null); // null mặc định
  const [cachPhongTranh, setCachPhongTranh] = useState('');

  useEffect(() => {
    const refMoiPhong = ref(database, 'MoiPhongLuaDao');
    onValue(refMoiPhong, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const maxStt = Math.max(...Object.values(data).map(item => item.stt || 0));
        setStt(maxStt + 1);
      } else {
        setStt(1);
      }
    });
  }, []);

  const handleLuu = () => {
    if (!title || !emailGui) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và email gửi');
      return;
    }
    if (ketQuaTraLoi === null) {
      Alert.alert('Lỗi', 'Vui lòng chọn kết quả trả lời');
      return;
    }

    const moiPhongRef = ref(database, 'MoiPhongLuaDao');
    const newRef = push(moiPhongRef);
    const newId = newRef.key;

    const dataMoiPhong = {
      idCauHoi: newId,
      stt,
      title,
      emailGui,
      noiDungEmail,
      ketQuaTraLoi,
      cachPhongTranh,
      createdAt: new Date().toISOString(),
    };

    set(newRef, dataMoiPhong)
      .then(() => {
        Alert.alert('Thành công', 'Đã lưu dữ liệu mô phỏng lừa đảo');
        setTitle('');
        setEmailGui('');
        setNoiDungEmail('');
        setKetQuaTraLoi(null);
        setCachPhongTranh('');
        setStt(stt + 1);
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Lưu dữ liệu thất bại: ' + error.message);
      });
  };

  // Component Radio Button
  const RadioButton = ({ label, value, selected, onPress }) => (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={() => onPress(value)}>
      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>STT (tự động): {stt}</Text>

      <Text style={styles.label}>Id câu hỏi (tự sinh khi lưu)</Text>
      <Text style={{ marginBottom: 10, color: '#666' }}>Để trống - hệ thống tự tạo</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Nhập tiêu đề"
      />

      <Text style={styles.label}>Email gửi</Text>
      <TextInput
        style={styles.input}
        value={emailGui}
        onChangeText={setEmailGui}
        placeholder="Nhập email người gửi"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Nội dung email</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={noiDungEmail}
        onChangeText={setNoiDungEmail}
        placeholder="Nhập nội dung email"
        multiline
      />

      {/* Bỏ phân loại */}

      <Text style={styles.label}>Kết quả trả lời</Text>
      <RadioButton
        label="Email lừa đảo"
        value="Email lừa đảo"
        selected={ketQuaTraLoi === 'Email lừa đảo'}
        onPress={setKetQuaTraLoi}
      />
      <RadioButton
        label="Email bình thường"
        value="Email bình thường"
        selected={ketQuaTraLoi === 'Email bình thường'}
        onPress={setKetQuaTraLoi}
      />

      <Text style={[styles.label, { marginTop: 20 }]}>Cách phòng tránh</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={cachPhongTranh}
        onChangeText={setCachPhongTranh}
        placeholder="Nhập cách phòng tránh"
        multiline
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Lưu" onPress={handleLuu} color="#1E90FF" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#1E90FF',
    backgroundColor: '#1E90FF',
  },
  radioLabel: {
    fontSize: 14,
  },
});

export default QuanlyScreen;
