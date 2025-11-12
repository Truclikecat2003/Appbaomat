"use client"

import { useState, useEffect } from "react"
import Toast from 'react-native-toast-message'

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import { database, ref, push, set } from "../firebaseConfig"

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const options = ["Góp ý về dịch vụ", "Góp ý về tính năng", "Ý kiến riêng"]

const badWords = ["con chó", "má mày", "cha mày"]

// Color system - Enterprise/Cybersecurity theme
const COLORS = {
  // Primary: Dark background
  bgPrimary: "#0A0E27",
  bgSecondary: "#141B35",
  bgTertiary: "#1A2347",

  // Accent: Cyan/Electric blue
  accentPrimary: "#00D9FF",
  accentSecondary: "#0099CC",
  accentLight: "#33E9FF",

  // Semantic colors
  success: "#00D97F",
  warning: "#FFB82D",
  error: "#FF3B5C",

  // Neutrals
  textPrimary: "#E8ECFF",
  textSecondary: "#A8B2D9",
  textTertiary: "#6B758B",

  // Borders
  borderPrimary: "#2D3A5F",
  borderSecondary: "#1F2A47",
}

const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: "700", letterSpacing: 0.5 },
  h2: { fontSize: 20, fontWeight: "600", letterSpacing: 0.3 },
  h3: { fontSize: 16, fontWeight: "600", letterSpacing: 0.2 },
  body: { fontSize: 14, fontWeight: "400", letterSpacing: 0 },
  caption: { fontSize: 12, fontWeight: "500", letterSpacing: 0 },
}

const { width } = Dimensions.get("window")

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const containsBadWords = (text) => {
  const lowerText = text.toLowerCase()
  return badWords.some((word) => lowerText.includes(word))
}

const calculateCharacterPercentage = (current, max) => {
  return (current / max) * 100
}

const getCharacterCountColor = (percentage) => {
  if (percentage < 50) return COLORS.success
  if (percentage < 80) return COLORS.warning
  return COLORS.error
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GopYScreen = ({ route }) => {
  const { userEmail } = route.params

  // ========== State Management ==========
  const [tieuDe, setTieuDe] = useState("")
  const [noiDung, setNoiDung] = useState("")
  const [loaiGopY, setLoaiGopY] = useState(options[0])
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Animation values
  const fadeAnim = new Animated.Value(0)
  const slideAnim = new Animated.Value(100)
  const scaleAnim = new Animated.Value(0.9)

  // ========== Constants ==========
  const MAX_TITLE_LENGTH = 100
  const MAX_CONTENT_LENGTH = 2000

  const titlePercentage = calculateCharacterPercentage(tieuDe.length, MAX_TITLE_LENGTH)
  const contentPercentage = calculateCharacterPercentage(noiDung.length, MAX_CONTENT_LENGTH)

  const titleCountColor = getCharacterCountColor(titlePercentage)
  const contentCountColor = getCharacterCountColor(contentPercentage)

  // ========== Effects ==========
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  useEffect(() => {
    // Reset submitted state after 4 seconds
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted])

  // ========== Event Handlers ==========
  const onSubmit = async () => {
    // Validation: Title
    if (!tieuDe.trim()) {
      Alert.alert("⚠️ Lỗi xác thực", "Vui lòng nhập tiêu đề góp ý của bạn")
      return
    }

    // Validation: Content
    if (!noiDung.trim()) {
      Alert.alert("⚠️ Lỗi xác thực", "Vui lòng nhập nội dung chi tiết cho góp ý")
      return
    }

    // Validation: Title length
    if (tieuDe.length > MAX_TITLE_LENGTH) {
      Alert.alert("⚠️ Lỗi xác thực", `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự`)
      return
    }

    // Validation: Content length
    if (noiDung.length > MAX_CONTENT_LENGTH) {
      Alert.alert("⚠️ Lỗi xác thực", `Nội dung không được vượt quá ${MAX_CONTENT_LENGTH} ký tự`)
      return
    }

    // Validation: Bad words in title
    if (containsBadWords(tieuDe)) {
      Alert.alert("⚠️ Lỗi nội dung", "Tiêu đề chứa từ khóa không phù hợp. Vui lòng kiểm tra lại.")
      return
    }

    // Validation: Bad words in content
    if (containsBadWords(noiDung)) {
      Alert.alert("⚠️ Lỗi nội dung", "Nội dung chứa từ khóa không phù hợp. Vui lòng kiểm tra lại.")
      return
    }

    // Submit to Firebase
    try {
      setIsLoading(true)

      const gopyRef = ref(database, "GopY")
      const newGopYRef = push(gopyRef)

      const feedbackData = {
        id: newGopYRef.key,
        email: userEmail,
        tieuDe: tieuDe.trim(),
        noiDung: noiDung.trim(),
        loaiGopY: loaiGopY,
        createdAt: new Date().toISOString(),
        status: "pending",
        version: "2.0",
      }

      await set(newGopYRef, feedbackData)

      setIsLoading(false)
      setIsSubmitted(true)

      Toast.show({
  type: 'success',
  text1: 'Gửi thành công 🎉',
  text2: 'Cảm ơn bạn đã góp ý!',
  position: 'bottom',
})

      // Reset form
      setTieuDe("")
      setNoiDung("")
      setLoaiGopY(options[0])
    } catch (error) {
      setIsLoading(false)
      Toast.show({
  type: 'error',
  text1: 'Lỗi hệ thống',
  text2: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
  position: 'bottom',
})

      console.error("Firebase submission error:", error)
    }
  }

  const handleModalOpen = () => {
    setModalVisible(true)
  }

  const handleSelectOption = (selectedOption) => {
    setLoaiGopY(selectedOption)
    setModalVisible(false)
  }

  // ========== Validation States ==========
  const isTitleValid = tieuDe.trim().length > 0
  const isContentValid = noiDung.trim().length > 0
  const isFormValid = isTitleValid && isContentValid && !containsBadWords(tieuDe) && !containsBadWords(noiDung)
  const canSubmit = isFormValid && !isLoading

  // ========== Rendering ==========
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.bgPrimary }]}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient}>
        <View style={[styles.gradientOrb, { backgroundColor: COLORS.accentPrimary, opacity: 0.03 }]} />
        <View
          style={[
            styles.gradientOrb,
            { bottom: "10%", right: "10%", backgroundColor: COLORS.accentSecondary, opacity: 0.02 },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* ===== HEADER SECTION ===== */}
          <View style={styles.headerSection}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>Phản hồi</Text>
            </View>

            <Text style={[styles.headerTitle, TYPOGRAPHY.h1]}>Gửi góp ý của bạn</Text>

            <Text style={[styles.headerSubtitle, TYPOGRAPHY.body]}>
              Ý kiến của bạn giúp chúng tôi cải thiện dịch vụ. Hãy chia sẻ các đề xuất và nhận xét của bạn.
            </Text>
          </View>

          {/* ===== USER INFO CARD ===== */}
          <View style={styles.userCard}>
            <View style={styles.userCardHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>{userEmail.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.userEmail, TYPOGRAPHY.caption]}>Tài khoản</Text>
                <Text style={[styles.userEmailValue, TYPOGRAPHY.body]} numberOfLines={1}>
                  {userEmail}
                </Text>
              </View>
              <View style={styles.userStatusBadge}>
                <View style={styles.statusDot} />
                <Text style={[styles.statusText, TYPOGRAPHY.caption]}>Sẵn sàng</Text>
              </View>
            </View>
          </View>

          {/* ===== FORM SECTION ===== */}
          <View style={styles.formSection}>
            {/* FIELD 1: Tiêu đề */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <Text style={[styles.fieldLabel, TYPOGRAPHY.h3]}>Tiêu đề góp ý</Text>
                <Text style={[styles.fieldLabelSub, TYPOGRAPHY.caption]}>Tóm tắt ngắn gọn ý kiến của bạn</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: isTitleValid ? COLORS.accentPrimary : COLORS.borderPrimary,
                      color: COLORS.textPrimary,
                    },
                  ]}
                  placeholder="VD: Cần thêm tính năng xác thực 2 yếu tố"
                  placeholderTextColor={COLORS.textTertiary}
                  value={tieuDe}
                  onChangeText={setTieuDe}
                  maxLength={MAX_TITLE_LENGTH}
                  editable={!isLoading}
                />

                <View style={styles.characterCounter}>
                  <Text style={[styles.characterCountText, { color: titleCountColor }, TYPOGRAPHY.caption]}>
                    {tieuDe.length}/{MAX_TITLE_LENGTH}
                  </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: COLORS.borderPrimary }]}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(titlePercentage, 100)}%`,
                        backgroundColor: titleCountColor,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* FIELD 2: Nội dung */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <Text style={[styles.fieldLabel, TYPOGRAPHY.h3]}>Nội dung chi tiết</Text>
                <Text style={[styles.fieldLabelSub, TYPOGRAPHY.caption]}>
                  Mô tả chi tiết góp ý hoặc ý tưởng của bạn
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.textAreaInput,
                    {
                      borderColor: isContentValid ? COLORS.accentPrimary : COLORS.borderPrimary,
                      color: COLORS.textPrimary,
                    },
                  ]}
                  placeholder="Hãy cung cấp chi tiết về góp ý của bạn..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={noiDung}
                  onChangeText={setNoiDung}
                  maxLength={MAX_CONTENT_LENGTH}
                  multiline
                  editable={!isLoading}
                  scrollEnabled={false}
                />

                <View style={styles.characterCounter}>
                  <Text style={[styles.characterCountText, { color: contentCountColor }, TYPOGRAPHY.caption]}>
                    {noiDung.length}/{MAX_CONTENT_LENGTH}
                  </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: COLORS.borderPrimary }]}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(contentPercentage, 100)}%`,
                        backgroundColor: contentCountColor,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* FIELD 3: Loại góp ý */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <Text style={[styles.fieldLabel, TYPOGRAPHY.h3]}>Phân loại</Text>
                <Text style={[styles.fieldLabelSub, TYPOGRAPHY.caption]}>Chọn loại góp ý phù hợp</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  {
                    borderColor: COLORS.accentPrimary,
                    backgroundColor: COLORS.bgTertiary,
                  },
                ]}
                onPress={handleModalOpen}
                disabled={isLoading}
              >
                <View style={styles.selectButtonContent}>
                  <View style={styles.selectIcon}>
                    <Text style={styles.selectIconEmoji}>📋</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.selectLabel, TYPOGRAPHY.caption]}>Loại góp ý</Text>
                    <Text style={[styles.selectValue, TYPOGRAPHY.body]}>{loaiGopY}</Text>
                  </View>
                  <View style={styles.selectArrow}>
                    <Text style={styles.arrowText}>›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
              <Text style={[styles.infoBoxTitle, TYPOGRAPHY.caption]}>💡 Mẹo gửi góp ý hiệu quả</Text>
              <Text style={[styles.infoBoxText, TYPOGRAPHY.caption]}>
                • Hãy rõ ràng và cụ thể về vấn đề hoặc tính năng
                {"\n"}• Cung cấp các bước tái tạo nếu báo cáo lỗi
                {"\n"}• Đề xuất giải pháp nếu có thể
                {"\n"}• Tránh sử dụng ngôn ngữ không phù hợp
              </Text>
            </View>
          </View>

          {/* ===== ACTION BUTTONS ===== */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: canSubmit ? COLORS.accentPrimary : COLORS.borderPrimary,
                  opacity: canSubmit ? 1 : 0.5,
                },
              ]}
              onPress={onSubmit}
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? (
                <View style={styles.buttonLoadingContent}>
                  <ActivityIndicator color={COLORS.bgPrimary} size="small" />
                  <Text style={[styles.submitButtonText, { marginLeft: 8, color: COLORS.bgPrimary }]}>Đang gửi...</Text>
                </View>
              ) : (
                <Text style={[styles.submitButtonText, { color: COLORS.bgPrimary }]}>Gửi góp ý</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { borderColor: COLORS.borderPrimary }]}
              onPress={() => {
                setTieuDe("")
                setNoiDung("")
                setLoaiGopY(options[0])
              }}
              disabled={isLoading}
            >
              <Text style={[styles.resetButtonText, { color: COLORS.accentPrimary }, TYPOGRAPHY.body]}>Làm mới</Text>
            </TouchableOpacity>
          </View>

          {/* ===== SUCCESS MESSAGE ===== */}
          {isSubmitted && (
            <Animated.View
              style={[
                styles.successCard,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.successIcon}>
                <Text style={styles.successIconEmoji}>✓</Text>
              </View>
              <Text style={[styles.successTitle, TYPOGRAPHY.h3]}>Góp ý đã gửi thành công!</Text>
              <Text style={[styles.successText, TYPOGRAPHY.body]}>Cảm ơn bạn đã giúp chúng tôi cải thiện.</Text>
            </Animated.View>
          )}

          {/* ===== FOOTER ===== */}
          <View style={styles.footerSection}>
            <View style={[styles.footerLine, { backgroundColor: COLORS.borderSecondary }]} />
            <Text style={[styles.footerText, TYPOGRAPHY.caption]}>
              Tất cả góp ý sẽ được bảo mật và xử lý trong vòng 48 giờ
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ===== MODAL: SELECT CATEGORY ===== */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: COLORS.bgPrimary + "99" }]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: COLORS.bgSecondary,
                borderColor: COLORS.borderPrimary,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, TYPOGRAPHY.h2]}>Chọn loại góp ý</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <FlatList
              scrollEnabled={false}
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelectOption(item)}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: loaiGopY === item ? COLORS.bgTertiary : "transparent",
                      borderBottomColor: COLORS.borderSecondary,
                      borderBottomWidth: index < options.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  <View style={styles.optionIndicator}>
                    {loaiGopY === item && (
                      <View style={[styles.optionRadio, { backgroundColor: COLORS.accentPrimary }]} />
                    )}
                  </View>
                  <Text style={[styles.optionText, TYPOGRAPHY.body]}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalFooterBtn, { backgroundColor: COLORS.borderSecondary }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalFooterBtnText, TYPOGRAPHY.body]}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      <Toast />
    </SafeAreaView>
  )
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // ===== LAYOUT =====
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // ===== BACKGROUND =====
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  gradientOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: "5%",
    left: "-10%",
  },

  // ===== HEADER SECTION =====
  headerSection: {
    marginBottom: 32,
  },
  headerBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.accentPrimary + "15",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accentPrimary + "40",
    marginBottom: 12,
  },
  headerBadgeText: {
    color: COLORS.accentPrimary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // ===== USER CARD =====
  userCard: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  userCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accentPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.accentLight,
  },
  userAvatarText: {
    color: COLORS.bgPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  userEmail: {
    color: COLORS.textTertiary,
  },
  userEmailValue: {
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  userStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.bgTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    color: COLORS.textSecondary,
  },

  // ===== FORM SECTION =====
  formSection: {
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 28,
  },
  fieldHeader: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
  },
  fieldLabelSub: {
    color: COLORS.textTertiary,
    marginTop: 4,
  },

  // ===== INPUT WRAPPER =====
  inputWrapper: {
    position: "relative",
  },
  textInput: {
    backgroundColor: COLORS.bgTertiary,
    borderWidth: 1.5,
    borderColor: COLORS.borderPrimary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "400",
    paddingRight: 50,
    minHeight: 44,
  },
  textAreaInput: {
    backgroundColor: COLORS.bgTertiary,
    borderWidth: 1.5,
    borderColor: COLORS.borderPrimary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "400",
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: "top",
  },
  characterCounter: {
    position: "absolute",
    top: 12,
    right: 14,
  },
  characterCountText: {
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.borderPrimary,
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // ===== SELECT BUTTON =====
  selectButton: {
    flexDirection: "row",
    backgroundColor: COLORS.bgTertiary,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  selectIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.accentPrimary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectIconEmoji: {
    fontSize: 18,
  },
  selectLabel: {
    color: COLORS.textTertiary,
  },
  selectValue: {
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  selectArrow: {
    marginLeft: 12,
  },
  arrowText: {
    color: COLORS.accentPrimary,
    fontSize: 20,
    fontWeight: "300",
  },

  // ===== INFO BOX =====
  infoBox: {
    backgroundColor: COLORS.accentPrimary + "08",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accentPrimary,
    borderRadius: 8,
    padding: 14,
    marginTop: 28,
  },
  infoBoxTitle: {
    color: COLORS.accentPrimary,
    marginBottom: 8,
    fontWeight: "600",
  },
  infoBoxText: {
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // ===== BUTTON GROUP =====
  buttonGroup: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: COLORS.accentPrimary,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  buttonLoadingContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.borderPrimary,
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  resetButtonText: {
    color: COLORS.accentPrimary,
    fontWeight: "600",
  },

  // ===== SUCCESS CARD =====
  successCard: {
    backgroundColor: COLORS.success + "15",
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 28,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.success + "25",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  successIconEmoji: {
    fontSize: 28,
    color: COLORS.success,
  },
  successTitle: {
    color: COLORS.success,
    marginBottom: 4,
  },
  successText: {
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // ===== FOOTER SECTION =====
  footerSection: {
    alignItems: "center",
    marginTop: 32,
    paddingVertical: 16,
  },
  footerLine: {
    width: "40%",
    height: 1,
    marginBottom: 12,
  },
  footerText: {
    color: COLORS.textTertiary,
    textAlign: "center",
  },

  // ===== MODAL =====
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.bgPrimary + "80",
  },
  modalContent: {
    backgroundColor: COLORS.bgSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderPrimary,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: {
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: "600",
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.borderPrimary,
    marginHorizontal: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    color: COLORS.textPrimary,
    flex: 1,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderPrimary,
    marginTop: 8,
  },
  modalFooterBtn: {
    backgroundColor: COLORS.borderSecondary,
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalFooterBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
})

export default GopYScreen
