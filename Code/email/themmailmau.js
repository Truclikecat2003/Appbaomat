"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert, ImageBackground } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, push, set, get } from "firebase/database"

export default function ThemMailMau() {
  const [selectedLanguage, setSelectedLanguage] = useState("vi")
  const [tieuDe, setTieuDe] = useState("")
  const [nguoiGui, setNguoiGui] = useState("")
  const [emailNguoiGui, setEmailNguoiGui] = useState("")
  const [tuKhoa, setTuKhoa] = useState("")
  const [noiDung, setNoiDung] = useState("")
  const [loading, setLoading] = useState(false)

  const languageOptions = {
    vi: "Tiếng Việt",
    en: "Tiếng Anh",
    zh: "Tiếng Trung",
    ko: "Tiếng Hàn",
  }

  const handleSave = async () => {
    if (!tieuDe || !nguoiGui || !emailNguoiGui || !noiDung) {
      return Alert.alert("⚠️ Thiếu thông tin", "Vui lòng điền đầy đủ các trường!")
    }
    setLoading(true)
    try {
      const taskRef = ref(database, `task1_email/${selectedLanguage}`)
      const snapshot = await get(taskRef)
      const existing = snapshot.exists() ? snapshot.val() : {}

      const newData = { tieuDe, nguoiGui, emailNguoiGui, tuKhoa, noiDung }
      const isDuplicate = Object.values(existing).some(
        (r) => JSON.stringify(r).toLowerCase() === JSON.stringify(newData).toLowerCase()
      )
      if (isDuplicate) {
        Alert.alert("❌ Email trùng", "Email này đã tồn tại trong cơ sở dữ liệu!")
        setLoading(false)
        return
      }

      const newRecordRef = push(taskRef)
      await set(newRecordRef, newData)
      Alert.alert("✅ Thành công", "Đã lưu email mẫu vào Firebase!")

      setTieuDe("")
      setNguoiGui("")
      setEmailNguoiGui("")
      setTuKhoa("")
      setNoiDung("")
    } catch (err) {
      console.error(err)
      Alert.alert("❌ Lỗi", "Không thể lưu dữ liệu!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/bg_Add1email.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardTransparent}>
          <Text style={styles.title}>THÊM EMAIL MẪU</Text>

          <View style={styles.languageSelector}>
            {Object.entries(languageOptions).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.langButton, selectedLanguage === key && styles.langButtonActive]}
                onPress={() => setSelectedLanguage(key)}
              >
                <Text style={[styles.langText, selectedLanguage === key && styles.langTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              style={styles.input}
              value={tieuDe}
              onChangeText={setTieuDe}
              placeholder="Nhập tiêu đề..."
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <Text style={styles.label}>Người gửi</Text>
            <TextInput
              style={styles.input}
              value={nguoiGui}
              onChangeText={setNguoiGui}
              placeholder="Nhập tên người gửi..."
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <Text style={styles.label}>Email người gửi</Text>
            <TextInput
              style={styles.input}
              value={emailNguoiGui}
              onChangeText={setEmailNguoiGui}
              placeholder="Nhập email..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Từ khóa</Text>
            <TextInput
              style={styles.input}
              value={tuKhoa}
              onChangeText={setTuKhoa}
              placeholder="Nhập từ khóa..."
              placeholderTextColor="rgba(255,255,255,0.4)"
            />

            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={[styles.input, { height: 120 }]}
              value={noiDung}
              onChangeText={setNoiDung}
              placeholder="Nhập nội dung email..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
            />
          </View>

          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.btnOutline, styles.btnReset]}
              onPress={() => {
                setTieuDe("")
                setNguoiGui("")
                setEmailNguoiGui("")
                setTuKhoa("")
                setNoiDung("")
                Alert.alert("Thông báo", "✅ Form đã được reset!")
              }}
            >
              <Icon name="plus-circle-outline" size={20} color="#00FFD1" style={{ marginRight: 6 }} />
              <Text style={styles.btnTextReset}> Nhập lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOutline, styles.btnSave]}
              onPress={handleSave}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="content-save-outline" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.btnTextSave}>Lưu</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  // <CHANGE> Cải thiện nền card: tối hơn, độ trong suốt tối ưu, viền sáng hơn
  cardTransparent: {
    width: "90%",
    backgroundColor: "rgba(15, 20, 50, 0.6)", // Nền tối với xanh đen, độ trong suốt 60%
    borderRadius: 20,
    padding: 20,
    borderWidth: 2.5,
    borderColor: "#00FFFF", // Viền cyan neon sáng
    shadowColor: "#00FFFF",
    shadowOpacity: 0.9,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 8 },
  },
  // <CHANGE> Tiêu đề màu trắng nổi bật hơn trên nền tối
  title: { fontSize: 26, color: "#FFFFFF", fontWeight: "bold", textAlign: "center", marginBottom: 20, letterSpacing: 1.5 },
  
  languageSelector: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  // <CHANGE> Cải thiện button ngôn ngữ: viền rõ ràng, nền tối hơn
  langButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, borderWidth: 2, borderColor: "#00D9FF", backgroundColor: "rgba(0, 217, 255, 0.1)" },
  langButtonActive: { backgroundColor: "#00D9FF", borderColor: "#00D9FF" },
  // <CHANGE> Text ngôn ngữ màu sáng hơn
  langText: { color: "#00D9FF", fontWeight: "700", fontSize: 13 },
  langTextActive: { color: "#0a0e27", fontWeight: "700" },

  form: { gap: 12 },
  // <CHANGE> Label màu sáng hơn để dễ đọc trên nền tối
  label: { color: "#FFFFFF", marginBottom: 6, fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  // <CHANGE> Input: nền sáng hơn, text trắng, viền neon rõ ràng
  input: { 
    backgroundColor: "rgba(255, 255, 255, 0.08)", 
    color: "#FFFFFF", 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1.5, 
    borderColor: "#00BFFF",
    fontSize: 14,
  },

  rowButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, gap: 10 },
  btnOutline: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, borderWidth: 2 },
  // <CHANGE> Nút "Thêm mới": nền cyan trong suốt, viền cyan sáng
  btnReset: { 
    borderColor: "#00FFD1", 
    backgroundColor: "rgba(0, 255, 209, 0.15)",
    shadowColor: "#00FFD1",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  btnTextReset: { fontSize: 15, fontWeight: "700", color: "#00FFD1" },
  
  // <CHANGE> Nút "Lưu": nền blue/magenta gradient, viền sáng, text trắng nổi bật
  btnSave: { 
    borderColor: "#FF00FF", 
    backgroundColor: "rgba(30, 144, 255, 0.35)",
    shadowColor: "#FF00FF",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  btnTextSave: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
})