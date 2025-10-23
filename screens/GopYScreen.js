import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, FlatList, StyleSheet, ScrollView } from 'react-native';
import { database, ref, push, set } from '../firebaseConfig';

const options = [
  "Góp ý về dịch vụ",
  "Góp ý về tính năng",
  "Ý kiến riêng"
];

// Danh sách từ khóa bậy cần chặn
const badWords = ['con chó', 'má mày', 'cha mày'];

const containsBadWords = (text) => {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
};

const GopYScreen = ({ route }) => {
  const { userEmail } = route.params;

  const [tieuDe, setTieuDe] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [loaiGopY, setLoaiGopY] = useState(options[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = async () => {
    if (!tieuDe.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên tiêu đề');
      return;
    }
    if (!noiDung.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung góp ý');
      return;
    }

    if (containsBadWords(tieuDe) || containsBadWords(noiDung)) {
      Alert.alert('Lỗi', 'Nội dung có chứa từ khóa không phù hợp.');
      return;
    }

    try {
      const gopyRef = ref(database, 'GopY');
      const newGopYRef = push(gopyRef);
      await set(newGopYRef, {
        id: newGopYRef.key,
        email: userEmail,
        tieuDe,
        noiDung,
        loaiGopY,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Thành công', 'Cảm ơn bạn đã gửi góp ý!');
      setTieuDe('');
      setNoiDung('');
      setLoaiGopY(options[0]);
    } catch (error) {
      Alert.alert('Lỗi', 'Gửi góp ý thất bại: ' + error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text>Email: {userEmail}</Text>

      <Text>Tên tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề góp ý"
        value={tieuDe}
        onChangeText={setTieuDe}
      />

      <Text>Nội dung góp ý</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        placeholder="Nhập nội dung góp ý"
        value={noiDung}
        onChangeText={setNoiDung}
      />

      <Text>Loại góp ý</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text>{loaiGopY}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setLoaiGopY(item);
                    setModalVisible(false);
                  }}
                  style={styles.optionItem}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Gửi góp ý</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 8,
    paddingVertical: 10,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default GopYScreen;
