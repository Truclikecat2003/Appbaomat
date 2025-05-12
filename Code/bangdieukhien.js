import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from './style';

const BangDieuKhien = () => {
  return (
    <View style={styles.dashboardBox}>
      <Text style={styles.dashboardTitle}>🔎 Bảng điều khiển an ninh</Text>

      <View style={styles.dashboardSummary}>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>📌 Mô-đun đã hoàn thành</Text>
          <Text style={styles.dashboardValue}>2/9</Text>
        </View>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>📊 Điểm trung bình</Text>
          <Text style={styles.dashboardValue}>78%</Text>
        </View>
        <View style={styles.dashboardItem}>
          <Text style={styles.dashboardLabel}>⏳ Thời gian đã dùng</Text>
          <Text style={styles.dashboardValue}>45 phút (Hôm qua)</Text>
        </View>
      </View>

      {/* Hoạt động gần đây */}
      <ScrollView>
        <Text style={styles.dashboardSectionTitle}>⚡ Hoạt Động Gần Đây</Text>
        <View style={styles.dashboardActivity}>
          <Text style={styles.activityTitle}>📬 Mô Phỏng Lừa Đảo</Text>
          <Text style={styles.activityStatus}>Hoàn thành - Độ chính xác: 80% (2 ngày trước)</Text>
        </View>
        <View style={styles.dashboardActivity}>
          <Text style={styles.activityTitle}>🔒 Bảo Mật Mật Khẩu</Text>
          <Text style={styles.activityStatus}>Hoàn thành thành công (3 ngày trước)</Text>
        </View>
        <View style={styles.dashboardActivity}>
          <Text style={styles.activityTitle}>🛑 Phòng Vệ Ransomware</Text>
          <Text style={styles.activityStatus}>Đang diễn ra (1 ngày trước)</Text>
        </View>

        {/* Nút điều hướng */}
        <TouchableOpacity style={styles.dashboardButton}>
          <Text style={styles.dashboardButtonText}>Xem Bảng Điều Khiển Đầy Đủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BangDieuKhien;
