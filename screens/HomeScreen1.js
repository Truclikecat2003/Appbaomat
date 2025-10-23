import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../Code/style';
import MenuComponent from '../Code/MenuComponent';
import CacBaiTrain from '../Code/CacBaiTrain';
import GiaoDuc from '../Code/GiaoDuc';
import BangDieuKhien from '../Code/bangdieukhien';
import * as ImagePicker from 'expo-image-picker';
import Login from '../Code/Login';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../Pic/anh.jpg'));
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const navigation = useNavigation(); // Điều hướng

  // Yêu cầu quyền truy cập camera/thư viện ảnh
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert("Quyền truy cập bị từ chối!", "Bạn cần cấp quyền để sử dụng tính năng này.");
      return false;
    }
    return true;
  };

  // Chụp ảnh từ camera
  const handleCapturePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setModalVisible(false);
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 4] });

    if (!result.canceled) {
      console.log("Ảnh chụp:", result.uri); // Kiểm tra ảnh có đúng không
      setAvatar({ uri: result.uri }); // Cập nhật avatar ngay sau khi chụp
    }
  };

  // Chọn ảnh từ thư viện
  const handlePickPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setModalVisible(false);
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 4] });

    if (!result.canceled) {
      console.log("Ảnh chọn:", result.uri); // Kiểm tra ảnh có đúng không
      setAvatar({ uri: result.uri }); // Cập nhật avatar ngay sau khi chọn
    }
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    Alert.alert("Thông báo", "Bạn đã đăng xuất", [
      { text: "OK", onPress: () => navigation.navigate('LoginScreen') } // Chuyển đến LoginScreen
    ]);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <Login goBack={() => setIsLoggedIn(false)} /> // Nếu đăng nhập, hiển thị Login.js
      ) : (
        <ScrollView style={styles.container}>
          {/* thanh menu */}
          <View style={styles.header}>
            {/* Nút menu (Căn trái) */}
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="menu" size={28} color="#333" />
            </TouchableOpacity>
            {/* Nút Danh bạ */}
            <TouchableOpacity style={styles.loginButton} onPress={() => Alert.alert("Danh bạ", "Tính năng đang phát triển")}>
              <Text style={styles.loginText}>📇 Danh bạ</Text>
            </TouchableOpacity>
            {/* Phần avatar + nút đăng nhập (Căn phải) */}
            <View style={styles.rightSection}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={avatar.uri ? avatar : require('../Pic/anh.jpg')} style={styles.avatar} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
                <Icon name="exit-to-app" size={28} /> {/* Biểu tượng thoát không màu */}
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

          {/* Hiển thị danh sách menu khi bấm vào nút */}
          {menuVisible && <MenuComponent />}
          {/* Thêm dòng văn bản ở dưới các nút */}
          <Text style={styles.description}>
            <Text style={styles.title}>Mô Phỏng Đào Tạo An Ninh Mạng</Text>{"\n"}
            <Text style={styles.italicText}>Học cách nhận biết và ứng phó với các mối đe dọa an ninh phổ biến</Text>
          </Text>
          {/* Thêm dòng kẻ ngang */}
          <View style={styles.separator}></View>
          <CacBaiTrain />
          {/* Kẻ ngang */}
          <View style={styles.separator}></View>
          {/* Thêm phần bảng điều khiển */}
          <BangDieuKhien />
          {/* Thông báo chỉ dành cho giáo dục */}
          <GiaoDuc />
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
