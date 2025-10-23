import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
} from 'react-native';
import { database, ref } from '../firebaseConfig';
import { onValue } from 'firebase/database';
const Admin_LichSuGopYScreen = () => {
  const [gopYList, setGopYList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gopYRef = ref(database, 'GopY');
    const unsubscribe = onValue(gopYRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển object sang array, sắp xếp theo thời gian tạo mới nhất
        const list = Object.values(data).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setGopYList(list);
      } else {
        setGopYList([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Lỗi khi lấy lịch sử góp ý:', error);
      setLoading(false);
    });

    return () => unsubscribe(); // Hủy lắng nghe khi unmount
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (gopYList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có góp ý nào được gửi.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.gopYItem}>
      <Text style={styles.tieuDe}>{item.tieuDe}</Text>
      <Text style={styles.noiDung}>{item.noiDung}</Text>
      <Text style={styles.loaiGopY}>Loại góp ý: {item.loaiGopY}</Text>
      <Text style={styles.email}>Người gửi: {item.email}</Text>
      <Text style={styles.createdAt}>
        Ngày gửi: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={gopYList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gopYItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  tieuDe: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  noiDung: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  loaiGopY: {
    fontStyle: 'italic',
    fontSize: 13,
    marginBottom: 4,
    color: '#666',
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default Admin_LichSuGopYScreen;
