// GiaoDuc.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';

const GiaoDuc = () => {
  return (
    <View style={styles.educationBox}>
      <Text style={styles.educationTitle}>📘 Chỉ dành cho mục đích giáo dục</Text>
      <Text style={styles.educationDescription}>
        Mô phỏng này được thiết kế cho mục đích giáo dục nhằm giúp người dùng nhận biết và ứng phó với các mối đe dọa an ninh.{"\n"}
        Tất cả các cuộc tấn công mô phỏng đều được chứa trong môi trường đào tạo này và không gây ra bất kỳ rủi ro an ninh thực tế nào.
      </Text>
    </View>
  );
};

export default GiaoDuc;
