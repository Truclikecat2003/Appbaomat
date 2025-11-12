import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../Code/style';
import MenuComponent from '../Code/MenuComponent';
import CacBaiTrain from '../Code/CacBaiTrain';
import GiaoDuc from '../Code/GiaoDuc';
import BangDieuKhien from '../Code/bangdieukhien';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database, ref, get, update } from '../firebaseConfig';

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../Pic/anh.jpg'));
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [lastLogin, setLastLogin] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const username = route.params?.username ?? '';

  const usernameKey = username.toLowerCase();

  useEffect(() => {
    const loadUserData = async () => {
      if (!usernameKey) return;
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userId = Object.keys(usersData).find(
            (id) => usersData[id].username?.toLowerCase() === usernameKey
          );
          if (userId) {
            const userData = usersData[userId];
            if (userData.avatar) setAvatar({ uri: userData.avatar });
            if (userData.lastLogin) setLastLogin(userData.lastLogin);
            if (userData.role) setRole(userData.role);
            if (userData.email) setEmail(userData.email);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu người dùng:', error);
      }
    };
    loadUserData();
  }, [usernameKey]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    Alert.alert('Thông báo', 'Bạn đã đăng xuất', [
      { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
    ]);
  };

  if (!isLoggedIn) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 10 }}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={{ color: '#2c2c2c', fontSize: 15, fontWeight: '500', fontStyle: 'italic', opacity: 0.9 }}>
          👤 {username}
        </Text>
      </View>

      <View style={[styles.header, { marginTop: 20 }]}>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Icon name="exit-to-app" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && <MenuComponent username={username} role={role} email={email} />}

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.title}>Mô Phỏng Đào Tạo An Ninh Mạng</Text>
        <Text style={styles.italicText}>Học cách nhận biết và ứng phó với các mối đe dọa an ninh phổ biến</Text>
      </View>

      <View style={styles.separator} />

      <CacBaiTrain navigation={navigation} />

      <View style={styles.separator} />

      <BangDieuKhien />
      <GiaoDuc />

      {lastLogin ? (
        <Text style={{ textAlign: 'center', marginVertical: 10, color: '#666', fontStyle: 'italic', fontSize: 12 }}>
          Lần cuối đăng nhập: {new Date(lastLogin).toLocaleString()}
        </Text>
      ) : null}
    </ScrollView>
  );
};

export default HomeScreen;
