import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ref, set, get } from 'firebase/database';
import { database } from '../firebaseConfig'; // điều chỉnh đường dẫn nếu cần

const ThongtinScreen = () => {
  const route = useRoute();
  const { userEmail } = route.params;

  const [email, setEmail] = useState(userEmail);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!email) return;

    const userRef = ref(database, 'users/' + email.replace('.', '_'));
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || '');
          setDob(data.dob || '');
          setGender(data.gender || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        }
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
      });
  }, [email]);

  // Hàm kiểm tra dữ liệu hợp lệ trước khi lưu
  const validateData = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return false;
    }

    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dobRegex.test(dob)) {
      alert('Ngày sinh không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy.');
      return false;
    }

    if (!gender) {
      alert('Vui lòng chọn giới tính.');
      return false;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập từ 9 đến 11 chữ số.');
      return false;
    }

    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ.');
      return false;
    }

    return true;
  };

  const saveDataToFirebase = () => {
    if (!email) return;

    if (!validateData()) {
      return; // Dữ liệu không hợp lệ, dừng không lưu
    }

    set(ref(database, 'users/' + email.replace('.', '_')), {
      name,
      dob,
      gender,
      phone,
      address,
    })
    .then(() => {
      alert('Lưu thông tin thành công!');
    })
    .catch((error) => {
      alert('Lỗi khi lưu thông tin: ' + error.message);
    });
  };

  const toggleEditSave = () => {
    if (isEditing) {
      saveDataToFirebase();
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Thông tin cá nhân</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#e9e9e9' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ tên"
          editable={isEditing}
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="dd/mm/yyyy"
          editable={isEditing}
        />

        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.genderRow}>
          {['Nam', 'Nữ', 'Khác'].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.genderOption}
              onPress={() => isEditing && setGender(item)}
            >
              <View style={styles.radioCircle}>
                {gender === item && <View style={styles.selectedDot} />}
              </View>
              <Text style={styles.genderLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          editable={isEditing}
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ"
          editable={isEditing}
        />

        <TouchableOpacity
          style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
          onPress={toggleEditSave}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Sửa'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#444',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fdfdfd',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },
  genderLabel: {
    fontSize: 15,
    color: '#333',
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#1E90FF',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ThongtinScreen;
