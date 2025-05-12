import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const chuyenGiaData = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: '2', name: 'Trần Thị B', phone: '0902345678' },
  { id: '3', name: 'Lê Văn C', phone: '0903456789' },
  { id: '4', name: 'Phạm Thị D', phone: '0904567890' },
  { id: '5', name: 'Hoàng Văn E', phone: '0905678901' },
];

const DanhBa = () => {
  const handleCall = (name, phone) => {
    Alert.alert('📞 Gọi', `Đang gọi cho ${name} (${phone})...`);
  };

  const handleMessage = (name) => {
    Alert.alert('💬 Nhắn tin', `Đang soạn tin nhắn cho ${name}...`);
  };

  const handleUrgent = (name) => {
    Alert.alert('🚨 Gấp!', `Gửi tín hiệu khẩn cấp tới ${name}!`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.phone}>📱 {item.phone}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleCall(item.name, item.phone)}>
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.buttonText}>Gọi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleMessage(item.name)}>
          <Icon name="message" size={20} color="#fff" />
          <Text style={styles.buttonText}>Nhắn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.urgentButton]} onPress={() => handleUrgent(item.name)}>
          <Icon name="alert-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Gấp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📇 Danh bạ Chuyên Gia</Text>
      <FlatList
        data={chuyenGiaData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default DanhBa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077cc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  urgentButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
});
