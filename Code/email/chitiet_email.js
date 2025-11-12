"use client"

import React, { useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import * as FileSystem from "expo-file-system/legacy"

import * as Sharing from "expo-sharing"
import ViewShot from "react-native-view-shot"

const ChiTiet_Email = ({ scamData = {} }) => {
  // Default scam data for Netflix phishing example
  const defaultScam = {
    title: "Lừa đảo Đăng ký Netflix",
    description:
      "Một nỗ lực gian lận email, mạo danh cấp thông tin thanh toán của bạn bằng cách tuyên bố có vấn đề với tài khoản của bạn.",
    phishingExample:
      "Họa sĩ email: no-reply@netflix.secure.update.com\nYêu cầu: Xác minh thông tin thanh toán\nĐường link: netflix-verify-account.xyz",
  }

  const scam = { ...defaultScam, ...scamData }

  const descriptions = [
    {
      id: 1,
      icon: "information-outline",
      title: "Mô tả",
      iconBg: "#3b82f6",
      content:
        "Lừa đảo này tận dụng uy tín của Netflix bằng cách gửi email giả mạo trông rất chuyên nghiệp. Kẻ lừa sẽ tuyên bố rằng tài khoản Netflix của bạn có vấn đề thanh toán hoặc sắp hết hạn. Họ yêu cầu bạn nhấp vào một liên kết để 'xác minh' hoặc 'cập nhật' thông tin thanh toán. Liên kết này dẫn đến một trang web giống hệt Netflix, nơi bạn được yêu cầu nhập chi tiết thẻ tín dụng, mật khẩu hoặc thông tin cá nhân khác. Tất cả thông tin này sau đó được gửi trực tiếp đến kẻ lừa để sử dụng cho các mục đích gian lận.",
    },
    {
      id: 2,
      icon: "eye-outline",
      title: "Dấu hiệu nhận biết",
      iconBg: "#8b5cf6",
      items: [
        "Email có chứa lỗi chính tả hoặc ngữ pháp (ví dụ: 'Kính guî' thay vì 'Kính gửi').",
        "Địa chỉ email gửi không phải từ netflix.com (ví dụ: netflix-verify.secure.com).",
        "Lời chào quá chung chung (ví dụ: 'Kính gửi khách hàng') thay vì gọi theo tên của bạn.",
        "Yêu cầu cấp thông tin nhạy cảm qua email (Netflix không bao giờ làm vậy).",
        "Liên kết không dẫn đến netflix.com chính thức khi bạn rê chuột (kiểm tra URL).",
        "Tạo cảm giác khẩn cấp giả tạo ('Hành động ngay trong vòng 24 giờ').",
        "Hình ảnh chất lượng thấp hoặc logo Netflix không chính xác.",
      ],
    },
    {
      id: 3,
      icon: "checkbox-marked-circle-outline",
      title: "Cần làm gì",
      iconBg: "#ef4444",
      items: [
        "Không nhấp vào bất kỳ liên kết nào trong email đó.",
        "Không tải xuống hoặc mở bất kỳ tệp đính kèm nào.",
        "Xóa email ngay lập tức hoặc chuyển vào thư mục Spam.",
        "Báo cáo email phishing cho Netflix tại phishing@netflix.com.",
        "Đánh dấu email là 'Lừa đảo' hoặc 'Spam' trong ứng dụng email của bạn.",
        "Nếu bạn lo lắng, hãy truy cập netflix.com trực tiếp (không qua email) để kiểm tra tài khoản.",
        "Cân nhắc thay đổi mật khẩu Netflix nếu bạn đã nhập thông tin.",
        "Kiểm tra báo cáo tài chính của bạn để phát hiện hoạt động gian lận.",
      ],
    },
  ]

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-50)).current
  const contentSlideAnim = useRef(descriptions.map(() => new Animated.Value(-100))).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const bounceAnim = useRef(new Animated.Value(0)).current

  const viewShotRef = useRef()

  const handleExportShare = async () => {
    try {
      Alert.alert("Chia sẻ nội dung", "Chọn định dạng", [
        {
          text: "Hình ảnh PNG",
          onPress: () => exportAsImage(),
        },
        {
          text: "PDF",
          onPress: () => exportAsPDF(),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ])
    } catch (error) {
      console.error("Export error:", error)
      Alert.alert("Lỗi", "Không thể chia sẻ nội dung")
    }
  }

  const exportAsImage = async () => {
    try {
      const uri = await viewShotRef.current.capture()
      const fileName = `scam-alert-${Date.now()}.png`
      const localUri = `${FileSystem.documentDirectory}${fileName}`
      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      })
      await Sharing.shareAsync(localUri)
    } catch (error) {
      console.error("Image export error:", error)
      Alert.alert("Lỗi", "Không thể xuất hình ảnh")
    }
  }

  const exportAsPDF = async () => {
    try {
      const uri = await viewShotRef.current.capture()
      const fileName = `scam-alert-${Date.now()}.pdf`
      const localUri = `${FileSystem.documentDirectory}${fileName}`

      // Note: For actual PDF conversion, use react-native-pdf-lib or similar
      // For now, share the image which can be converted to PDF by the user
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        filename: fileName,
      })

      Alert.alert("Thành công", "Nội dung đã sẵn sàng để chia sẻ")
    } catch (error) {
      console.error("PDF export error:", error)
      Alert.alert("Lỗi", "Không thể xuất PDF")
    }
  }

  React.useEffect(() => {
    // Fade in main container
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start()

    // Header slide-in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    // Content slides-in staggered
    const contentAnimations = contentSlideAnim.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    )
    Animated.stagger(100, contentAnimations).start()

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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

    // Bounce animation for title
    Animated.timing(bounceAnim, {
      toValue: 1,
      duration: 700,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [])

  return (
     <View style={{ flex: 1, backgroundColor: "#0a0f1c" }}>
    <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.95 }} style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
        {/* Header */}
        <Animated.View style={[styles.headerTop, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
            <Icon name="chevron-left" size={28} color="#06b6d4" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết Lừa đảo</Text>
          <View style={{ width: 28 }} />
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Main Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              { transform: [{ scale: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] },
            ]}
          >
            <LinearGradient
              colors={["#0a0f1c", "#1a2a48"]}
              style={styles.titleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconWrapper}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Icon name="alert" size={28} color="#ef4444" />
                </Animated.View>
              </View>
              <Text style={styles.mainTitle}>{scam.title}</Text>
              <Text style={styles.descText}>{scam.description}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Phishing Example */}
          <View style={styles.exampleSection}>
            <Text style={styles.sectionLabel}>Ví dụ về Email Lừa đảo</Text>
            <View style={styles.divider} />
            <View style={styles.exampleCard}>
              <LinearGradient
                colors={["#1e293b", "#0f172a"]}
                style={styles.exampleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.exampleContent}>
                  <Text style={styles.exampleText}>{scam.phishingExample}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Detail Sections */}
          {descriptions.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[styles.detailSection, { transform: [{ translateX: contentSlideAnim[index] }] }]}
            >
              <LinearGradient
                colors={["#1e293b", "#0f172a"]}
                style={styles.detailGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.detailHeader}>
                  <View style={[styles.detailIconBg, { backgroundColor: item.iconBg + "20" }]}>
                    <Icon name={item.icon} size={22} color={item.iconBg} />
                  </View>
                  <Text style={styles.detailTitle}>{item.title}</Text>
                </View>

                {item.items ? (
                  <View style={styles.itemsList}>
                    {item.items.map((itemText, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.listText}>{itemText}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.detailContent}>{item.content}</Text>
                )}
              </LinearGradient>
            </Animated.View>
          ))}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.reportBtn} activeOpacity={0.8}>
              <LinearGradient
                colors={["#0ea5e9", "#0284c7"]}
                style={styles.reportGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="flag" size={18} color="#ffffff" />
                <Text style={styles.reportText}>Báo cáo Lừa đảo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} onPress={handleExportShare}>
              <LinearGradient
                colors={["#f0f9ff", "#dbeafe"]}
                style={styles.shareGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="share-variant" size={18} color="#0284c7" />
                <Text style={styles.shareText}>Chia sẻ cho bạn bè</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
       </Animated.View>
    </ViewShot>

    {/* Footer luôn dính cuối */}
    <View style={styles.footer}>
      {[
        { icon: "home-outline", label: "Trang chủ", color: "#06b6d4" },
        { icon: "shield-check-outline", label: "Kiểm tra", color: "#10b981" },
        { icon: "clock-outline", label: "Báo cáo", color: "#ef4444" },
        { icon: "chart-bar", label: "Thống kê", color: "#8b5cf6" },
        { icon: "account-circle-outline", label: "Hồ sơ", color: "#f59e0b" },
      ].map((btn, idx) => (
        <TouchableOpacity key={idx} style={styles.footerBtn} activeOpacity={0.7}>
          <View style={[styles.footerIconBg, { borderColor: btn.color + "40" }]}>
            <Icon name={btn.icon} size={22} color={btn.color} />
          </View>
          <Text style={styles.footerText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1c",
    flexDirection: "column",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#10b98120",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10b98110",
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f0f9ff",
    letterSpacing: 0.3,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 30,
    flexGrow: 1,
  },
  titleSection: {
    marginBottom: 28,
  },
  titleGradient: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef444440",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: "#ef444420",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ef444440",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#06b6d4",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  descText: {
    fontSize: 14,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 20,
  },
  exampleSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f0f9ff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#10b98140",
    marginBottom: 14,
  },
  exampleCard: {
    borderRadius: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exampleGradient: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#10b98120",
  },
  exampleContent: {
    paddingVertical: 4,
  },
  exampleText: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "monospace",
  },
  detailSection: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  detailGradient: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#10b98120",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  detailIconBg: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#06b6d4",
    letterSpacing: 0.2,
  },
  detailContent: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 20,
  },
  itemsList: {
    gap: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginRight: 10,
    marginTop: 7,
    flexShrink: 0,
  },
  listText: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  reportBtn: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reportGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  reportText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  shareBtn: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0284c740",
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  shareText: {
    color: "#0284c7",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#10b98130",
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

export default ChiTiet_Email
