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
  },
  {
    id: '2',
    type: 'Video',
    icon: '🎥',
    color: '#D32F2F',
    lightColor: '#FFEBEE',
    accentColor: '#FF006E',
    titles: [
      'Khóa học React Native cơ bản trên YouTube',
      'Hacking from begin to pro P1',
      'Hacking from begin to pro P2',
      'Hack with python',
      'Cybersecurity and Human Rights – ảnh hưởng đến quyền con người',
      'International Human Rights in Cyberspace – pháp lý và công dân',
      'Cyber Scams and Human Trafficking (Việt Nam và Đông Nam Á)',
      'The Ethics of CyberSecurity – những vấn đề đạo đức',
      'Cybersecurity, Democracy and Human Rights – phân tích chính trị'
    ],
    urls: [
      'https://www.youtube.com/watch?v=0-S5a0eXPoc',
      'https://www.youtube.com/watch?v=cKEf8H9cQGM&t=60s',
      'https://www.youtube.com/watch?v=QaXZJO1WlRA',
      'https://www.youtube.com/watch?v=VNvNuIDrZo0',
      'https://www.youtube.com/watch?v=zc4BiNDxNRk',
      'https://www.youtube.com/watch?v=B7QVmUfT81s',
      'https://www.youtube.com/watch?v=-vXNcx8jyck',
      'https://www.youtube.com/watch?v=IKVaK5fU5io',
      'https://www.youtube.com/watch?v=W1f2Xzj0Nro'
    ]
  },
  {
    id: '3',
    type: 'PDF',
    icon: '📄',
    color: '#7B1FA2',
    lightColor: '#F3E5F5',
    accentColor: '#8338EC',
    titles: [
      'Tài liệu học React Native PDF',
      'CISSP Study Guide.pdf',
      'Cybersecurity and Human Rights – a human‑centric overview',
      'A Human Rights‑Based Approach to Cybersecurity',
      'Travel Guide to the Digital World: Cybersecurity for HRDs',
      'National Cybersecurity Strategies and Human Rights',
      'Human Rights for the Digital Age'
    ],
    urls: [
      'https://reactnative.dev/docs/assets/react-native.pdf',
      'https://drive.google.com/file/d/1GeIu2rSWx8Tu65Stou1vwJ-xfG6eqVCd/view?usp=drive_link',
      'https://www.gp-digital.org/wp-content/uploads/2015/06/GCCS2015-Webinar-Series-Introductory-Text.pdf',
      'https://www.apc.org/sites/default/files/APCExplainers_cybersecurity.pdf',
      'https://www.gp-digital.org/wp-content/uploads/2016/05/Travel-Guide-to-the-Digital-World_Cybersecurity-Policy-for-HRD.pdf',
      'https://www.gp-digital.org/wp-content/uploads/2022/04/Assessing-NCSS-from-human-rights-perspective.pdf',
      'https://arxiv.org/pdf/2408.17302.pdf'
    ]
  },
  {
    id: '4',
    type: 'App',
    icon: '📱',
    color: '#F57C00',
    lightColor: '#FFF3E0',
    accentColor: '#FFBE0B',
    titles: ['Ứng dụng học thêm kiến thức về an ninh mạng'],
    urls: ['https://drive.google.com/file/d/1zCubLHkL6w4wmEQjy61TmRCdpV7zGTne/view?usp=drive_link']
  },
  {
    id: '5',
    type: 'Diễn đàn',
    icon: '💬',
    color: '#00796B',
    lightColor: '#E0F2F1',
    accentColor: '#00D9A3',
    titles: ['Diễn đàn công nghệ, nơi cập nhật những kiến thức mới nhất về bảo mật'],
    urls: ['https://whitehat.vn']
  }
];

// Animated Background Component
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
      <LinearGradient
        colors={['#F5F7FA', '#FFFFFF', '#F0F4F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />
      <Animated.View style={[styles.animatedBlob, { transform: [{ translateX: translateX1 }, { translateY: translateY1 }], top: '10%', left: '5%' }]}>
        <View style={[styles.blob, { backgroundColor: 'rgba(0, 217, 255, 0.08)' }]} />
      </Animated.View>
      <Animated.View style={[styles.animatedBlob, { transform: [{ translateX: translateX2 }, { translateY: translateY2 }], bottom: '15%', right: '10%' }]}>
        <View style={[styles.blob, { backgroundColor: 'rgba(255, 0, 110, 0.06)' }]} />
      </Animated.View>
      <Animated.View style={[styles.animatedBlob, { transform: [{ translateX: translateX1 }, { translateY: translateY2 }], top: '50%', right: '5%' }]}>
        <View style={[styles.blob, { backgroundColor: 'rgba(131, 56, 236, 0.05)' }]} />
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
              <TouchableOpacity key={index} onPress={() => Linking.openURL(item.urls[index])} activeOpacity={0.6} style={[styles.linkItem, { borderLeftColor: item.color, backgroundColor: item.lightColor + '20' }]}>
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
      {/* Header hiển thị username và role + Title */}
      <View style={styles.topHeader}>
        <Text style={styles.usernameText}>👤 {username} </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={true}
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
    top: 0, // giảm khoảng cách trên
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  roleText: { fontSize: 14, fontStyle: 'italic', color: '#555' },
  listContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 30, zIndex: 10 },
  headerSection: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  mainTitle: { fontSize: 36, fontWeight: '900', color: '#1a1a2e', marginBottom: 8, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 16, textAlign: 'center', fontWeight: '500' },
  headerLineContainer: { alignItems: 'center' },
  headerLine: { width: 80, height: 4, backgroundColor: '#0066CC', borderRadius: 2 },
  cardWrapper: { marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, borderLeftWidth: 5, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16, gap: 14 },
  iconContainer: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  iconText: { fontSize: 28 },
  headerContent: { flex: 1 },
  categoryTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  itemCountText: { fontSize: 12, color: '#999', fontWeight: '500' },
  expandButton: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  expandArrow: { fontSize: 13, fontWeight: '700' },
  expandedContent: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FAFAFA', borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 10 },
  linkItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderLeftWidth: 4, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  linkIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  linkArrow: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  linkTitle: { fontSize: 13, color: '#333', flex: 1, lineHeight: 20, fontWeight: '500' },
});
