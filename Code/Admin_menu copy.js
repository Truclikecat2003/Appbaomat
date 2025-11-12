import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const Admin_menu = ({ username, role }) => {
  const navigation = useNavigation();

  // Chuẩn bị object để truyền xuống các màn hình con
  const userData = { username, role };

  return (
    <View style={styles.menuContainer}>
      {/* 📚 Tài liệu */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e0b378' }]}
        onPress={() => navigation.navigate('TailieuScreen', { userData })}
      >
        <Icon name="book" size={20} color="#333" />
        <Text style={styles.menuText}>Tài liệu</Text>
      </TouchableOpacity>

      {/* 👤 Thông tin cá nhân */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d9c2ff' }]}
        onPress={() => navigation.navigate('ThongtinScreen', { userData })}
      >
        <Icon name="school-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Thông tin cá nhân</Text>
      </TouchableOpacity>

      {/* 💬 Quản lý người dùng */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d4f5e9' }]}
        onPress={() => navigation.navigate('Admin_Quanlyuser', { userData })}
      >
        <Icon name="account-group-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Quản lý người dùng</Text>
      </TouchableOpacity>

      {/* 📊 Lịch sử góp ý */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d0f0ff' }]}
        onPress={() => navigation.navigate('Admin_LichSuGopYScreen', { userData })}
      >
        <Icon name="chart-bar" size={20} color="#333" />
        <Text style={styles.menuText}>Lịch sử góp ý</Text>
      </TouchableOpacity>

      {/* 🔔 Phản hồi */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d07890' }]}
        onPress={() => navigation.navigate('PhanHoi', { userData })}
      >
        <Icon name="chat" size={20} color="#333" />
        <Text style={styles.menuText}>Phản Hồi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Admin_menu;
