import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style'; 

const CacBaiTrain = () => {
  return (
    <>
    {/* Bài: Mô phỏng lừa đảo */}
    <View style={styles.warningBox}>
      <Text style={styles.warningTitle}>⚠️ Mô Phỏng Lừa Đảo</Text>
      <Text style={styles.chung}>Học cách nhận biết email và liên kết đáng ngờ.</Text>
      <Text style={styles.gioithieu}>
        Đây là mô-đun giúp bạn tìm hiểu về các cuộc tấn công lừa đảo phổ biến.
      </Text>
      {/* Nút bắt đầu đào tạo */}
      <TouchableOpacity style={styles.trainingButton}>
        <Text style={styles.trainingButtonText}>Bắt Đầu Đào Tạo</Text>
      </TouchableOpacity>
    </View>
    {/* Bài: Bảo mật mật khẩu */}
    <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>🔒 Bảo Mật Mật Khẩu</Text>
        <Text style={styles.chung}>Thực hành tạo mật khẩu mạnh và quản lý thông tin đăng nhập.</Text>
        <Text style={styles.intrusionDescription}>
          Tìm hiểu các phương pháp tốt nhất để quản lý mật khẩu và cách bảo vệ tài khoản khỏi truy cập trái phép.
        </Text>
        <TouchableOpacity style={styles.securityButton}>
          <Text style={styles.securityButtonText}>Bắt Đầu Đào Tạo</Text>
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
          <Text style={styles.malwareButtonText}>Bắt Đầu Đào Tạo</Text>
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
          <Text style={styles.socialEngineeringButtonText}>Bắt Đầu Đào Tạo</Text>
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
          <Text style={styles.ransomwareButtonText}>Bắt Đầu Đào Tạo</Text>
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
          <Text style={styles.intrusionButtonText}>Bắt Đầu Đào Tạo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CacBaiTrain;
