"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Animated } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import Footer from "./footer"

const CheckEmails = () => {
  const [emailContent, setEmailContent] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState(null)
  const [fadeAnim] = useState(new Animated.Value(0))

  const handleCheck = async () => {
    if (!emailContent.trim()) {
      alert("Vui lòng dán nội dung email")
      return
    }

    setIsChecking(true)
    // Simulate checking - replace with actual API call
    setTimeout(() => {
      // Randomly show safe or dangerous result
      const isSafe = Math.random() > 0.5
      setResults({
        isSafe,
        title: isSafe ? "An toàn" : "Nguy hiểm",
        description: isSafe
          ? "Không tìm thấy liên kết kết đăng ngộ, ngôn ngữ khán cấp hoặc các chỉ số lừa đảo phổ biến khác."
          : "Email này có chứa các yếu tố đăng ngộ. Cần thận trọng khi tương tác.",
      })
      setIsChecking(false)

      // Animate results
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }, 2000)
  }

  const handleClear = () => {
    setEmailContent("")
    setResults(null)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerTop}>
        <Icon name="shield" size={28} color="#06b6d4" />
        <Text style={styles.headerTitle}>Kiểm tra Email</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Usage Section */}
        <Text style={styles.sectionTitle}>Nội dung Email</Text>

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Dán nội dung email vào đây"
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={8}
            value={emailContent}
            onChangeText={setEmailContent}
            editable={!isChecking}
          />
          {emailContent.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear} disabled={isChecking}>
              <Icon name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Check Button */}
        <TouchableOpacity
          style={[styles.checkBtn, isChecking && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={isChecking}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isChecking ? ["#64748b", "#475569"] : ["#3b82f6", "#2563eb"]}
            style={styles.checkGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isChecking ? (
              <>
                <Icon name="loading" size={18} color="#ffffff" />
                <Text style={styles.checkText}>Đang phân tích...</Text>
              </>
            ) : (
              <>
                <Icon name="check-circle" size={18} color="#ffffff" />
                <Text style={styles.checkText}>Kiểm tra ngay</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Results Section */}
        {results && (
          <Animated.View style={[styles.resultsSection, { opacity: fadeAnim }]}>
            <Text style={styles.resultsTitle}>Kết quả phân tích</Text>

            {/* Safe Result Card */}
            {results.isSafe && (
              <View style={styles.safeCard}>
                <LinearGradient
                  colors={["#dcfce7", "#bbf7d0"]}
                  style={styles.safeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.resultIconBg}>
                    <Icon name="shield-check" size={32} color="#16a34a" />
                  </View>
                  <Text style={styles.resultTitle}>{results.title}</Text>
                  <Text style={styles.resultDesc}>{results.description}</Text>
                  <TouchableOpacity style={styles.detailLink}>
                    <Text style={styles.detailLinkText}>Xem chi tiết</Text>
                    <Icon name="chevron-down" size={16} color="#2563eb" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}

            {/* Danger Result Card */}
            {!results.isSafe && (
              <View style={styles.dangerCard}>
                <LinearGradient
                  colors={["#fee2e2", "#fecaca"]}
                  style={styles.dangerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.resultIconBg}>
                    <Icon name="shield-alert" size={32} color="#dc2626" />
                  </View>
                  <Text style={[styles.resultTitle, { color: "#dc2626" }]}>{results.title}</Text>
                  <Text style={[styles.resultDesc, { color: "#7f1d1d" }]}>{results.description}</Text>
                  <TouchableOpacity style={styles.detailLink}>
                    <Text style={styles.detailLinkText}>Xem chi tiết</Text>
                    <Icon name="chevron-down" size={16} color="#2563eb" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer */}
      <Footer onNavPress={(id) => console.log("Navigated to:", id)} />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f0f9ff",
    letterSpacing: 0.3,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f0f9ff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    color: "#f0f9ff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#10b98130",
    textAlignVertical: "top",
    minHeight: 140,
  },
  clearBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#0a0f1c",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  checkBtn: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkBtnDisabled: {
    opacity: 0.6,
  },
  checkGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  checkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  resultsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f0f9ff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  safeCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  safeGradient: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#86efac40",
  },
  dangerCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerGradient: {
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fca5a540",
  },
  resultIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff40",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 8,
  },
  resultDesc: {
    fontSize: 13,
    color: "#166534",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  detailLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailLinkText: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
})

export default CheckEmails
