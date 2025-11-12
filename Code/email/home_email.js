"use client"

import React, { useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"

const Home_Email = () => {
  const scams = [
    {
      id: 1,
      title: "Giả mạo ngân hàng",
      desc: "Kẻ gian gửi email, tin nhắn mạo danh ngân hàng yêu cầu cung cấp thông tin tài khoản.",
    },
    {
      id: 2,
      title: "Thông báo trúng thưởng",
      desc: "Email thông báo trúng thưởng để dụ người nhận cung cấp thông tin cá nhân hoặc nạp tiền.",
    },
    {
      id: 3,
      title: "Giả danh cơ quan nhà nước",
      desc: "Giả danh công an, thuế, viện kiểm sát... để hù dọa, lừa nộp tiền hoặc thông tin cá nhân.",
    },
    {
      id: 4,
      title: "Liên kết độc hại",
      desc: "Gửi đường link giả đến trang web mạo danh để lấy cắp thông tin hoặc cài mã độc.",
    },
    {
      id: 5,
      title: "Đầu tư, cho vay siêu lợi nhuận",
      desc: "Mồi chài tham gia đầu tư, cho vay hoặc góp vốn với lợi nhuận bất thường.",
    },
  ]

  const adviceItems = [
    { text: "Không cung cấp mã OTP, mật khẩu, hoặc thông tin cá nhân qua mạng" },
    { text: "Luôn kiểm tra kỹ đường link, email gửi đến" },
    { text: "Cập nhật ứng dụng và hệ điều hành thường xuyên" },
    { text: "Báo cáo khi phát hiện dấu hiệu lừa đảo" },
  ]

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(scams.map(() => new Animated.Value(-100))).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const bounceAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    // Fade in main container
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start()

    // Slide-in animation for cards
    const slideAnimations = slideAnim.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    )
    Animated.stagger(80, slideAnimations).start()

    // Pulse animation for alert icons
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    )
    pulse.start()

    // Bounce animation for header
    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 800,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.headerWrapper,
            { transform: [{ scale: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] },
          ]}
        >
          <LinearGradient
            colors={["#0a0f1c", "#1a2a48"]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconWrapper}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Icon name="shield-alert" size={32} color="#10b981" />
                </Animated.View>
              </View>
              <Text style={styles.title}>Cảnh báo lừa đảo</Text>
              <Text style={styles.subtitle}>Bảo vệ tài chính của bạn từ các mối đe dọa trực tuyến</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Các hình thức lừa đảo phổ biến</Text>
          <View style={styles.divider} />

          {scams.map((item, index) => (
            <Animated.View key={item.id} style={[styles.card, { transform: [{ translateX: slideAnim[index] }] }]}>
              <LinearGradient
                colors={["#1e293b", "#0f172a"]}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconCircle}>
                    <Icon name="alert-decagram" size={20} color="#10b981" />
                  </View>
                  <View style={styles.cardTextWrapper}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        <View style={styles.advice}>
          <Text style={styles.sectionTitle}>Lời khuyên bảo mật</Text>
          <View style={styles.divider} />

          <View style={styles.adviceContainer}>
            {adviceItems.map((item, idx) => (
              <View key={idx} style={styles.adviceItem}>
                <View style={styles.adviceIcon}>
                  <Icon name="check-circle" size={18} color="#10b981" />
                </View>
                <Text style={styles.adviceText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {[
          { icon: "home-outline", label: "Trang chủ", color: "#06b6d4" },
          { icon: "shield-check-outline", label: "Kiểm tra", color: "#10b981" },
          { icon: "message-alert-outline", label: "Báo cáo", color: "#ef4444" },
          { icon: "chart-bar", label: "Thống kê", color: "#8b5cf6" },
        ].map((btn, idx) => (
          <TouchableOpacity key={idx} style={styles.footerBtn} activeOpacity={0.7}>
            <View style={[styles.footerIconBg, { borderColor: btn.color + "40" }]}>
              <Icon name={btn.icon} size={22} color={btn.color} />
            </View>
            <Text style={styles.footerText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1c",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 140,
  },
  headerWrapper: {
    marginBottom: 32,
  },
  header: {
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#10b98140",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: "center",
    width: "100%",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#10b98120",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#10b98140",
  },
  title: {
    fontSize: 26,
    color: "#f0f9ff",
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: "#f0f9ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#10b98140",
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#10b98115",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#10b98140",
    flexShrink: 0,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    color: "#06b6d4",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  cardDesc: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  advice: {
    marginBottom: 40,
  },
  adviceContainer: {
    gap: 10,
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#10b98108",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#10b98120",
  },
  adviceIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  adviceText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#10b98130",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBtn: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  footerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    backgroundColor: "#0a0f1c",
  },
  footerText: {
    color: "#cbd5e1",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
})

export default Home_Email
