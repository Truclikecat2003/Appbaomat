import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, push, set, get } from "firebase/database"
import { useNavigation } from "@react-navigation/native" // React Navigation

export default function AD_LoaiCauhoihotro() {
  const navigation = useNavigation() // Khởi tạo navigation
  const [maLoai, setMaLoai] = useState("")
  const [tenLoai, setTenLoai] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const generateUniqueCode = async () => {
    try {
      const loaiRef = ref(database, "LoaiCauhoiHotro")
      const snapshot = await get(loaiRef)
      const existingCodes = snapshot.exists() ? Object.values(snapshot.val()).map(item => item.maLoai) : []

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let code = ""
      let attempts = 0

      do {
        code = ""
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        attempts++
        if (attempts > 50) break
      } while (existingCodes.includes(code))

      setMaLoai(code)
    } catch (e) {
      console.error(e)
      Alert.alert("❌ Lỗi", "Không thể sinh mã!")
    }
  }

  const handleSave = async () => {
    if (!maLoai.trim() || !tenLoai.trim()) {
      Alert.alert("Thông báo", "⚠️ Vui lòng nhập đầy đủ thông tin!")
      return
    }

    setIsSaving(true)
    try {
      const loaiRef = ref(database, "LoaiCauhoiHotro")
      const snapshot = await get(loaiRef)
      const existing = snapshot.exists() ? snapshot.val() : {}

      const isDuplicate = Object.values(existing).some(
        (item) => item.maLoai === maLoai || item.tenLoai === tenLoai
      )

      if (isDuplicate) {
        Alert.alert("Trùng dữ liệu", "⚠️ Mã Loại hoặc Tên Loại đã tồn tại!")
        setIsSaving(false)
        return
      }

      const newRef = push(loaiRef)
      await set(newRef, {
        idloai: newRef.key,
        maLoai,
        tenLoai
      })

      Alert.alert("✔️ Thành công", "Đã thêm loại câu hỏi mới!")
      setMaLoai("")
      setTenLoai("")
    } catch (error) {
      console.error(error)
      Alert.alert("❌ Lỗi", "Lỗi khi lưu dữ liệu!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/bg_neon.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>THÊM LOẠI CÂU HỎI MỚI</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Mã Loại</Text>
            <View style={styles.maLoaiContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nhập mã loại câu hỏi... hoặc nhấn nút 'Tự sinh mã'"
                placeholderTextColor="#aaa"
                value={maLoai}
                onChangeText={setMaLoai}
              />
              <TouchableOpacity style={styles.randomBtn} onPress={generateUniqueCode}>
                <Text style={styles.randomBtnText}>Tự sinh mã</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Tên Loại</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Nhập tên loại câu hỏi..."
              placeholderTextColor="#aaa"
              value={tenLoai}
              multiline
              onChangeText={setTenLoai}
            />
          </View>

          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: "#00FF00" }]}
              onPress={() => {
                setMaLoai("")
                setTenLoai("")
                Alert.alert("Thông báo", "✅ Form đã được reset!")
              }}
            >
              <Icon name="plus-circle-outline" size={20} color="#00FF00" style={{ marginRight: 6 }} />
              <Text style={[styles.btnText, { color: "#00FF00" }]}>Thêm mới</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: "#00BFFF" }]}
              onPress={handleSave}
            >
              {isSaving ? <ActivityIndicator color="#00BFFF" /> : (
                <>
                  <Icon name="content-save-outline" size={20} color="#00BFFF" style={{ marginRight: 6 }} />
                  <Text style={[styles.btnText, { color: "#00BFFF" }]}>Lưu</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: "#FF3300" }]}
              onPress={() => {
                if (!maLoai && !tenLoai) {
                  Alert.alert("Thông báo", "⚠️ Chưa có gì để xóa!")
                } else {
                  setMaLoai("")
                  setTenLoai("")
                  Alert.alert("Thông báo", "🗑️ Nội dung đã được xóa!")
                }
              }}
            >
              <Icon name="trash-can-outline" size={20} color="#FF3300" style={{ marginRight: 6 }} />
              <Text style={[styles.btnText, { color: "#FF3300" }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => {
    console.log("Đã nhấn nút Quản lý loại câu hỏi");
    navigation.navigate("AD_QuanlyLoaiCauhoi")
  }} // Sửa navigation
        >
          <Icon name="database-outline" size={20} color="#FFD700" style={{ marginRight: 6 }} />
          <Text style={[styles.btnText, { color: "#FFD700" }]}>Quản lý loại câu hỏi</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { 
     flexGrow: 1,
  justifyContent: "center",
  alignItems: "center",   // <-- THÊM để căn giữa ngang
  paddingVertical: 40     // <-- đổi padding để không phá layout chiều ngang
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#00FFFF",
    shadowColor: "#00FFFF",
    shadowOpacity: 0.8,
    shadowRadius: 20
  },
  title: { fontSize: 26, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  formContainer: { width: "100%" },
  maLoaiContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  label: { color: "#fff", marginBottom: 6, fontSize: 20, fontWeight: "bold" },
  input: { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#00FFFF" },
  randomBtn: { marginLeft: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, borderColor: "#FF6600", backgroundColor: "rgba(0,0,0,0.3)" },
  randomBtnText: { color: "#FF6600", fontWeight: "700" },
  rowButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  btnOutline: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, marginHorizontal: 4, borderWidth: 2, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.3)" },
  btnText: { fontSize: 15, fontWeight: "700" },
  manageBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "rgba(0,0,0,0.5)",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8
  }
})
