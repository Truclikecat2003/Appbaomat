import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const MenuComponent = ({ userEmail }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e0b378' }]}
        onPress={() => navigation.navigate('TailieuScreen')}
      >
        <Icon name="book" size={20} color="#333" />
        <Text style={styles.text}>Tài liệu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d9c2ff' }]}
        onPress={() => navigation.navigate('ThongtinScreen', { userEmail })}

      >
        <Icon name="school-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Thông tin cá nhân</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d4f5e9' }]}
        onPress={() => navigation.navigate('GopYScreen', { userEmail })}
      >
        <Icon name="comment-text-outline" size={20} color="#333" />
        <Text style={styles.menuText}>Đóng góp ý kiến</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d0f0ff' }]}
        onPress={() => navigation.navigate('LichSuGopYScreen', { userEmail })}
      >
        <Icon name="chart-bar" size={20} color="#333" />
        <Text style={styles.menuText}>Lịch sử góp ý</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d0f0561' }]}
        onPress={() => navigation.navigate('ThongBaoScreen', { userEmail })}
      >
        <Icon name="ring" size={20} color="#333" />
        <Text style={styles.menuText}>Thông báo</Text>
      </TouchableOpacity>

    </View>
  );
};

export default MenuComponent;
