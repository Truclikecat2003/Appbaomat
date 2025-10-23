import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const MenuComponent = ({ username, role }) => {
  const navigation = useNavigation();

  // Chuẩn bị object để truyền xuống các màn con
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

      {/* 💬 Đóng góp ý kiến */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d4f5e9' }]}
        onPress={() => navigation.navigate('GopYScreen', { userData })}
      >
        <Icon name="comment-text-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Đóng góp ý kiến</Text>
      </TouchableOpacity>

      {/* 📊 Lịch sử góp ý */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d0f0ff' }]}
        onPress={() => navigation.navigate('LichSuGopYScreen', { userData })}
      >
        <Icon name="chart-bar" size={20} color="#333" />
        <Text style={styles.menuText}>Lịch sử góp ý</Text>
      </TouchableOpacity>

      {/* 🔔 Thông báo */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d0f056' }]}
        onPress={() => navigation.navigate('ThongBaoScreen', { userData })}
      >
        <Icon name="bell-ring-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Thông báo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuComponent;
