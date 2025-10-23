import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { database, ref } from '../firebaseConfig';
import { onValue } from 'firebase/database';
import { useRoute } from '@react-navigation/native';

const ThongBaoScreen = () => {
  const [phanHoiList, setPhanHoiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { userEmail } = route.params; // Email user truyền từ màn hình trước

  useEffect(() => {
    const phanHoiRef = ref(database, 'PhanHoi');

    const unsubscribe = onValue(phanHoiRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Lọc phản hồi dành cho user này
      const filtered = Object.values(data).filter(item => item.email === userEmail);

      // Sắp xếp theo thời gian mới nhất trước
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPhanHoiList(filtered);
      setLoading(false);
    }, (error) => {
      console.error('Lỗi lấy dữ liệu phản hồi:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (phanHoiList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có phản hồi từ admin nào.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.title}>Phản hồi từ admin</Text>
      <Text style={styles.subject}>{item.tieuDe}</Text>
      <Text style={styles.content}>{item.noiDung}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={phanHoiList}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: 'red',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: { color: 'red', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  subject: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  content: { fontSize: 14, color: '#333', marginBottom: 6 },
  date: { fontSize: 12, color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});

export default ThongBaoScreen;
