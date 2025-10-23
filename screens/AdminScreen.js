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
import { database, ref, get, set } from '../firebaseConfig';

const AdminScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../Pic/anh.jpg'));
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [lastLogin, setLastLogin] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const userEmail = route.params?.userEmail ?? '';
  const userId = userEmail.split('@')[0];

  useEffect(() => {
    const loadAvatar = async () => {
      if (!userId) return;
      try {
        const avatarRef = ref(database, 'avatars/' + userId);
        const snapshot = await get(avatarRef);
        if (snapshot.exists()) {
          const uri = snapshot.val();
          if (uri) {
            setAvatar({ uri });
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải avatar:', error);
      }
    };
    loadAvatar();
  }, [userId]);

  useEffect(() => {
    const loadLastLogin = async () => {
      if (!userId) return;
      try {
        const userRef = ref(database, 'users/' + userId);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.lastLogin) {
            setLastLogin(userData.lastLogin);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải lastLogin:', error);
      }
    };
    loadLastLogin();
  }, [userId]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert("Quyền truy cập bị từ chối!", "Bạn cần cấp quyền để sử dụng tính năng này.");
      return false;
    }
    return true;
  };

  const saveAvatarToFirebase = async (uri) => {
    try {
      const avatarRef = ref(database, 'avatars/' + userId);
      await set(avatarRef, uri);
    } catch (error) {
      console.error('Lỗi khi lưu avatar lên Firebase:', error);
    }
  };

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    Alert.alert("Thông báo", "Bạn đã đăng xuất", [
      { text: "OK", onPress: () => navigation.navigate('LoginScreen') }
    ]);
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? null : (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="menu" size={28} color="#333" />
            </TouchableOpacity>

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

          {/* TRUYỀN userEmail QUA props CHO MenuComponent */}
          {menuVisible && <Admin_menu userEmail={userEmail} />}

          <Text style={styles.description}>
            <Text style={styles.title}>Mô Phỏng Đào Tạo An Ninh Mạng</Text>{"\n"}
            <Text style={styles.italicText}>Học cách nhận biết và ứng phó với các mối đe dọa an ninh phổ biến</Text>
          </Text>

          <View style={styles.separator}></View>

          {/* <CacBaiTrain navigation={navigation} /> */}
          <QLTrain navigation={navigation}/>

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
