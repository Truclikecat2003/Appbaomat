import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Picker, Modal } from 'react-native';

const initialData = [
  {
    Idtailieu: '1',
    tentailieu: 'Tài liệu React Native PDF',
    loai: 'pdf',
    link: 'https://reactnative.dev/docs/assets/react-native.pdf',
    ngaytao: '2025-10-23',
    nguoitao: 'admin'
  }
];

export default function QuanLyTaiLieuScreen({ route }) {
  const username = route.params?.userData?.username ?? 'admin';
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDoc, setNewDoc] = useState({ tentailieu: '', loai: 'web', link: '', ngaytao: '', nguoitao: username });

  const addDocument = () => {
    if (!newDoc.tentailieu || !newDoc.link || !newDoc.ngaytao) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    const id = (data.length + 1).toString();
    setData([...data, { ...newDoc, Idtailieu: id }]);
    setNewDoc({ tentailieu: '', loai: 'web', link: '', ngaytao: '', nguoitao: username });
    setModalVisible(false);
  };

  const deleteDocument = (id) => {
    setData(data.filter(item => item.Idtailieu !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.tentailieu}</Text>
      <Text>Loại: {item.loai}</Text>
      <Text>Link: {item.link}</Text>
      <Text>Ngày tạo: {item.ngaytao}</Text>
      <Text>Người tạo: {item.nguoitao}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDocument(item.Idtailieu)}>
        <Text style={{color: 'white'}}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={{color: 'white'}}>Thêm Tài Liệu</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.Idtailieu}
        renderItem={renderItem}
        style={{ marginTop: 16 }}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>Thêm Tài Liệu Mới</Text>
          <TextInput
            placeholder="Tên tài liệu"
            value={newDoc.tentailieu}
            onChangeText={(text) => setNewDoc({ ...newDoc, tentailieu: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Link tài liệu"
            value={newDoc.link}
            onChangeText={(text) => setNewDoc({ ...newDoc, link: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Ngày tạo (YYYY-MM-DD)"
            value={newDoc.ngaytao}
            onChangeText={(text) => setNewDoc({ ...newDoc, ngaytao: text })}
            style={styles.input}
          />
          <Text>Loại tài liệu:</Text>
          <Picker
            selectedValue={newDoc.loai}
            onValueChange={(value) => setNewDoc({ ...newDoc, loai: value })}
            style={{marginBottom: 16}}
          >
            <Picker.Item label="Web" value="web" />
            <Picker.Item label="Video" value="video" />
            <Picker.Item label="PDF" value="pdf" />
            <Picker.Item label="App" value="app" />
            <Picker.Item label="Diễn đàn" value="dien-dan" />
          </Picker>

          <TouchableOpacity style={styles.addButton} onPress={addDocument}>
            <Text style={{color: 'white'}}>Thêm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.addButton, {backgroundColor: 'grey', marginTop: 12}]} onPress={() => setModalVisible(false)}>
            <Text style={{color: 'white'}}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#0066CC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  }
});
