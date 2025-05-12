// MenuComponent.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';

const MenuComponent = () => {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#e0bbf8' }]}>
        <Icon name="translate" size={20} color="#333" />
        <Text style={styles.text}>Ngôn ngữ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#d9c2ff' }]}>
        <Icon name="school-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Chế độ học</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#d4f5e9' }]}>
        <Icon name="comment-text-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Đóng góp ý kiến</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#d0f0ff' }]}>
        <Icon name="chart-bar" size={20} color="#333" />
        <Text style={styles.menuText}>Thống kê</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuComponent;
