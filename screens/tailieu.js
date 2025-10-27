// tailieu.js - Professional High-Tech Design with Animated Background
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const data = [
  {
    id: '1',
    type: 'Web',
    icon: '🌐',
    color: '#0066CC',
    lightColor: '#E3F2FD',
    accentColor: '#00D9FF',
    titles: [
      'Bảo đảm an ninh con người trên không gian mạng từ góc độ pháp luật tại Việt Nam',
      'Giải pháp bảo vệ người dân trên không gian mạng',
      'Những điều cần biết để an toàn trong không gian mạng (UNICEF)',
      'Không gian mạng là gì? Quyền con người trên không gian mạng? (Luật Minh Khuê)',
      'Bảo vệ quyền riêng tư & thông tin cá nhân của người dân trên không gian mạng',
      'Bảo vệ quyền con người trên không gian mạng trong bối cảnh đại dịch COVID-19',
      'Toàn bộ quy định về An ninh mạng & an toàn thông tin mới nhất',
      'Cybersecurity Law – đảm bảo quyền con người ở Việt Nam',
      'Tổng quan quy định về an ninh mạng tại Việt Nam',
      'Chiến lược an ninh mạng quốc gia Việt Nam đến năm 2025'
    ],
    urls: [
      'https://lsvn.vn/bao-dam-an-ninh-con-nguoi-tren-khong-gian-mang-tu-goc-do-phap-luat-tai-viet-nam-1705592311-a140159.html',
      'https://baochinhphu.vn/giai-phap-bao-ve-nguoi-dan-tren-khong-gian-mang-102221124123025802.htm',
      'https://www.unicef.org/vietnam/vi/nhung-dieu-can-biet-de-toan-trong-khong-gian-mang',
      'https://luatminhkhue.vn/khong-gian-mang-la-gi-phap-luat-ve-quyen-con-nguoi-tren-khong-gian-mang.aspx',
      'https://qltt.vn/bao-ve-quyen-rieng-tu-va-thong-tin-ca-nhan-cua-nguoi-dan-tren-khong-gian-mang-99675.html',
      'https://www.quanlynhanuoc.vn/2022/08/18/bao-ve-quyen-con-nguoi-tren-khong-gian-mang-trong-boi-canh-dai-dich-covid-19/',
      'https://thuvienphapluat.vn/chu-de-van-ban/159/toan-bo-quy-dinh-ve-an-ninh-mang-va-an-toan-thong-tin-tren-khong-gian-mang-moi-nhat',
      'https://tapchiqptd.vn/en/events-and-comments/cybersecurity-law-an-important-guarantee-of-human-rights-enforcement-in-vietnam/13126.html',
      'https://generisonline.com/an-overview-of-cybersecurity-regulations-in-vietnam/',
      'https://lawnet.vn/thong-tin-phap-luat/en/chinh-sach-moi/national-cyber-security-and-safety-strategy-proactively-responding-to-challenges-from-cyberspace-in-vietnam-127855.html'
    ]
  }
];

// 🌈 Animated Background
const AnimatedBackground = () => {
  const animValue1 = useRef(new Animated.Value(0)).current;
  const animValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue1, { toValue: 1, duration: 8000, useNativeDriver: false }),
        Animated.timing(animValue1, { toValue: 0, duration: 8000, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue2, { toValue: 1, duration: 10000, useNativeDriver: false }),
        Animated.timing(animValue2, { toValue: 0, duration: 10000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const translateX1 = animValue1.interpolate({ inputRange: [0, 1], outputRange: [0, 50] });
  const translateY1 = animValue1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const translateX2 = animValue2.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const translateY2 = animValue2.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });

  return (
    <View style={styles.backgroundContainer}>
      <LinearGradient colors={['#F5F7FA', '#FFFFFF', '#F0F4F8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBg} />
      <Animated.View style={[styles.animatedBlob, { transform: [{ translateX: translateX1 }, { translateY: translateY1 }], top: '10%', left: '5%' }]}>
        <View style={[styles.blob, { backgroundColor: 'rgba(0, 217, 255, 0.08)' }]} />
      </Animated.View>
      <Animated.View style={[styles.animatedBlob, { transform: [{ translateX: translateX2 }, { translateY: translateY2 }], bottom: '15%', right: '10%' }]}>
        <View style={[styles.blob, { backgroundColor: 'rgba(255, 0, 110, 0.06)' }]} />
      </Animated.View>
    </View>
  );
};

export default function TailieuScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const username = route.params?.userData?.username ?? '';
  const role = route.params?.userData?.role ?? '';

  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.7} style={styles.cardWrapper}>
      <View style={[styles.card, { borderLeftColor: item.color }]}>
        <LinearGradient colors={[item.lightColor, '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.categoryTitle, { color: item.color }]}>{item.type}</Text>
            <Text style={styles.itemCountText}>{item.titles.length} tài liệu</Text>
          </View>
          <View style={[styles.expandButton, { backgroundColor: item.lightColor }]}>
            <Text style={[styles.expandArrow, { color: item.color }]}>{expandedId === item.id ? '▼' : '▶'}</Text>
          </View>
        </LinearGradient>

        {expandedId === item.id && (
          <View style={styles.expandedContent}>
            {item.titles.map((title, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(item.urls[index])}
                activeOpacity={0.6}
                style={[styles.linkItem, { borderLeftColor: item.color, backgroundColor: item.lightColor + '20' }]}
              >
                <View style={[styles.linkIconBox, { backgroundColor: item.accentColor }]}>
                  <Text style={styles.linkArrow}>→</Text>
                </View>
                <Text style={styles.linkTitle}>{title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {/* 👤 Username + nút Quản lý (chỉ admin) */}
      <View style={styles.topHeader}>
        <Text style={styles.usernameText}>👤 {username}</Text>
        {role === 'admin' && (
          <TouchableOpacity
            style={styles.adminButton}
            // Truyền User name và Role khi điều hướng
            onPress={() => navigation.navigate('QuanLyTaiLieu', { userData: { username, role } })}
          >
            <Text style={styles.adminButtonText}>Quản lý</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>Thư Viện Tài Liệu</Text>
            <Text style={styles.subtitle}>An Ninh Mạng & Quyền Con Người</Text>
            <View style={styles.headerLineContainer}>
              <View style={styles.headerLine} />
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  backgroundContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  gradientBg: { ...StyleSheet.absoluteFillObject },
  animatedBlob: { position: 'absolute', zIndex: 1 },
  blob: { width: 300, height: 300, borderRadius: 150 },
  topHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10
  },
  usernameText: { fontSize: 16, fontWeight: '600', color: '#333' },
  adminButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  adminButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  listContent: { paddingHorizontal: 16, paddingTop: 100, paddingBottom: 30 },
  headerSection: { alignItems: 'center', paddingVertical: 16 },
  mainTitle: { fontSize: 34, fontWeight: '900', color: '#1a1a2e', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#555', marginBottom: 12, fontWeight: '500' },
  headerLineContainer: { alignItems: 'center' },
  headerLine: { width: 80, height: 4, backgroundColor: '#0066CC', borderRadius: 2 },
  cardWrapper: { marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderLeftWidth: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, gap: 14 },
  iconContainer: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 28 },
  headerContent: { flex: 1 },
  categoryTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4, textTransform: 'uppercase' },
  itemCountText: { fontSize: 12, color: '#999', fontWeight: '500' },
  expandButton: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  expandArrow: { fontSize: 13, fontWeight: '700' },
  expandedContent: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 10 },
  linkItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderLeftWidth: 4, gap: 12 },
  linkIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  linkArrow: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  linkTitle: { fontSize: 13, color: '#333', flex: 1, lineHeight: 20, fontWeight: '500' },
});
