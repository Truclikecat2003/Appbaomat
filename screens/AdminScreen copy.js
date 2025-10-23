import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../Code/style';
import MenuComponent from '../Code/MenuComponent';
import Admin_menu from '../Code/Admin_menu';
import CacBaiTrain from '../Code/CacBaiTrain';
import QLTrain from '../Code/QLTrain';
import GiaoDuc from '../Code/GiaoDuc';
import BangDieuKhien from '../Code/bangdieukhien';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { database, ref, get, set, update, push } from '../firebaseConfig';

const AdminScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../Pic/anh.jpg'));
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [lastLogin, setLastLogin] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const username = route.params?.username ?? '';
  const usernameKey = username.toLowerCase();

  // ✅ Load avatar từ bảng users
  useEffect(() => {
    const loadAvatar = async () => {
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
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải avatar:', error);
      }
    };
    loadAvatar();
  }, [usernameKey]);

  // ✅ Xin quyền truy cập ảnh
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối!', 'Bạn cần cấp quyền để sử dụng tính năng này.');
      return false;
    }
    return true;
  };

  // ✅ Lưu avatar trực tiếp vào bảng users (cột avatar)
  const saveAvatarToFirebase = async (uri) => {
    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userId = Object.keys(usersData).find(
          (id) => usersData[id].username?.toLowerCase() === usernameKey
        );

        if (userId) {
          const userRef = ref(database, `users/${userId}`);
          await update(userRef, { avatar: uri });
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu avatar:', error);
    }
  };

  // ✅ Chụp ảnh
  const handleCapturePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    setModalVisible(false);

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar({ uri });
      saveAvatarToFirebase(uri);
    }
  };

  // ✅ Chọn ảnh từ thư viện
  const handlePickPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    setModalVisible(false);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar({ uri });
      saveAvatarToFirebase(uri);
    }
  };

  // ✅ Đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    Alert.alert('Thông báo', 'Bạn đã đăng xuất', [
      { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
    ]);
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? null : (
        <ScrollView style={styles.container}>
          {/* Thanh trên cùng */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 16,
              marginTop: 10,
              zIndex: 20,
            }}
          >
            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="menu" size={28} color="#333" />
            </TouchableOpacity>

            <Text
              style={{
                color: '#2c2c2c',
                fontSize: 15,
                fontWeight: '500',
                fontStyle: 'italic',
                opacity: 0.9,
              }}
            >
              👤 {username}
            </Text>
          </View>

          {/* Header */}
          <View style={[styles.header, { marginTop: 20 }]}>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('DanhBaScreen')}>
              <Text style={styles.loginText}>📇 Danh bạ</Text>
            </TouchableOpacity>

            <View style={styles.rightSection}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={avatar} style={styles.avatar} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
                <Icon name="exit-to-app" size={28} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Modal chọn ảnh */}
          <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalButton} onPress={handleCapturePhoto}>
                  <Text style={styles.modalText}>📷 Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handlePickPhoto}>
                  <Text style={styles.modalText}>🖼 Chọn ảnh từ thiết bị</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalText}>❌ Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {menuVisible && <Admin_menu username={{username, role}} />}

          <Text style={styles.description}>
            <Text style={styles.title}>Mô Phỏng Đào Tạo An Ninh Mạng</Text>{'\n'}
            <Text style={styles.italicText}>
              Học cách nhận biết và ứng phó với các mối đe dọa an ninh phổ biến
            </Text>
          </Text>

          <View style={styles.separator}></View>

          <QLTrain navigation={navigation} />

          <View style={styles.separator}></View>

          <BangDieuKhien />
          <GiaoDuc />

          {lastLogin ? (
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 10,
                color: '#666',
                fontStyle: 'italic',
                fontSize: 12,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Lần cuối đăng nhập: {new Date(lastLogin).toLocaleString()}
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

export default AdminScreen;
