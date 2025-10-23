import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style'; 
import { useNavigation } from '@react-navigation/native';
const QLTrain = () => {
  const navigation = useNavigation();
  return (
    <>
    {/* Bài: Mô phỏng lừa đảo */}
    <View style={styles.warningBox}>
      <Text style={styles.warningTitle}>⚠️ Mô Phỏng Lừa Đảo</Text>
      <Text style={styles.chung}>Học cách nhận biết email và liên kết đáng ngờ.</Text>
      <Text style={styles.gioithieu}>
        Đây là mô-đun giúp bạn tìm hiểu về các cuộc tấn công lừa đảo phổ biến.
      </Text>
      {/* Nút Quản Lý đào tạo */}
      <TouchableOpacity 
        style={styles.trainingButton} 
        onPress={() => navigation.navigate('QuanlyScreen')}
      >
        <Text style={styles.trainingButtonText}>Quản Lý Đào Tạo</Text>
      </TouchableOpacity>
    </View>
     

      {/* Bài: Ứng phó phần mềm độc hại */}
      <View style={styles.malwareBox}>
        <Text style={styles.malwareTitle}>🛑 Ứng Phó Phần Mềm Độc Hại</Text>
        <Text style={styles.intrusionDescription}>Học cách nhận biết và ứng phó với phần mềm độc hại tiềm ẩn.</Text>
        <Text style={styles.gioithieu}>
          Mô phỏng này dạy bạn cách nhận biết dấu hiệu phần mềm độc hại và các bước cần thực hiện.
        </Text>
        <TouchableOpacity style={styles.malwareButton}>
          <Text style={styles.malwareButtonText}>Quản Lý Đào Tạo</Text>
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator}></View>

      {/* Bài: Kỹ thuật xã hội */}
      <View style={styles.socialEngineeringBox}>
        <Text style={styles.socialEngineeringTitle}>🔍 Kỹ Thuật Xã Hội</Text>
        <Text style={styles.intrusionDescription}>
          Học cách nhận biết và phòng vệ chống lại các chiến thuật thao túng.
        </Text>
        <Text style={styles.gioithieu}>
          Tìm hiểu cách các cuộc tấn công kỹ thuật xã hội khai thác tâm lý để lấy thông tin bí mật.
        </Text>
        <TouchableOpacity style={styles.socialEngineeringButton}>
          <Text style={styles.socialEngineeringButtonText}>Quản Lý Đào Tạo</Text>
        </TouchableOpacity>
      </View>

      {/* Bài: Phòng vệ ransomware */}
      <View style={styles.ransomwareBox}>
        <Text style={styles.ransomwareTitle}>🛑 Phòng Vệ Ransomware</Text>
        <Text style={styles.chung}>Nhận biết và ứng phó với các cuộc tấn công ransomware.</Text>
        <Text style={styles.intrusionDescription}>
          Trải nghiệm các popup ransomware giả mạo đòi thanh toán Bitcoin và học cách nhận biết.
        </Text>
        <TouchableOpacity style={styles.ransomwareButton}>
          <Text style={styles.ransomwareButtonText}>Quản Lý Đào Tạo</Text>
        </TouchableOpacity>
      </View>

      {/* Bài: Ứng phó xâm nhập */}
      <View style={styles.intrusionBox}>
        <Text style={styles.intrusionTitle}>🔐 Ứng Phó Xâm Nhập</Text>
        <Text style={styles.chung}>Thực hành phản ứng nhanh với các sự cố bảo mật.</Text>
        <Text style={styles.intrusionDescription}>
          Học cách phản ứng khi phát hiện hoạt động đáng ngờ, bao gồm khóa màn hình tự động.
        </Text>
        <TouchableOpacity style={styles.intrusionButton}>
          <Text style={styles.intrusionButtonText}>Quản Lý Đào Tạo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default QLTrain;

