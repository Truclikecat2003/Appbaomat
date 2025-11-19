"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, push, set, get, update, remove } from "firebase/database"

export default function AD_QuanlyLoaiCauhoi() {
  const [loaiList, setLoaiList] = useState([])
  const [filteredList, setFilteredList] = useState([]) 
  const [searchText, setSearchText] = useState("")

  const [maLoai, setMaLoai] = useState("")
  const [tenLoai, setTenLoai] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const loadLoai = async () => {
    try {
      const loaiRef = ref(database, "LoaiCauhoiHotro")
      const snapshot = await get(loaiRef)
      const data = snapshot.exists()
        ? Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value }))
        : []

      setLoaiList(data)
      setFilteredList(data)
    } catch (error) {
      Alert.alert("❌ Lỗi", "Không thể tải danh sách loại câu hỏi!")
    }
  }

  useEffect(() => {
    loadLoai()
  }, [])

  useEffect(() => {
    const text = searchText.toLowerCase()

    const filtered = loaiList.filter(item =>
      item.maLoai.toLowerCase().includes(text) ||
      item.tenLoai.toLowerCase().includes(text)
    )

    setFilteredList(filtered)
  }, [searchText, loaiList])

  const handleSave = async () => {
    if (!maLoai.trim() || !tenLoai.trim()) {
      Alert.alert("⚠️ Thông báo", "Vui lòng nhập đầy đủ thông tin!")
      return
    }

    setIsSaving(true)

    try {
      const loaiRef = ref(database, "LoaiCauhoiHotro")
      const snapshot = await get(loaiRef)
      const existing = snapshot.exists() ? snapshot.val() : {}

      let duplicateMessages = []
      Object.entries(existing).forEach(([key, item]) => {
        if (key !== editingId) {
          if (item.maLoai === maLoai) duplicateMessages.push(`⚠️ Mã "${maLoai}" đã tồn tại!`)
          if (item.tenLoai.toLowerCase() === tenLoai.toLowerCase())
            duplicateMessages.push(`⚠️ Tên loại "${tenLoai}" đã tồn tại!`)
        }
      })

      if (duplicateMessages.length > 0) {
        Alert.alert("Trùng dữ liệu", duplicateMessages.join("\n"))
        setIsSaving(false)
        return
      }

      if (editingId) {
        const updateRef = ref(database, `LoaiCauhoiHotro/${editingId}`)
        await update(updateRef, { maLoai, tenLoai })
        Alert.alert("✔️ Đã cập nhật", `Đã cập nhật loại "${tenLoai}"!`)
      } else {
        const newRef = push(loaiRef)
        await set(newRef, { idloai: newRef.key, maLoai, tenLoai })
        Alert.alert("✔️ Thành công", `Đã thêm loại "${tenLoai}"!`)
      }

      setMaLoai("")
      setTenLoai("")
      setEditingId(null)
      loadLoai()
    } catch (error) {
      Alert.alert("❌ Lỗi", "Lỗi khi lưu dữ liệu!")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = (id, name) => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn xóa loại "${name}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa", style: "destructive", onPress: async () => {
            try {
              await remove(ref(database, `LoaiCauhoiHotro/${id}`))
              Alert.alert("✔️ Đã xóa", `"${name}" đã được xóa!"`)
              loadLoai()

              if (editingId === id) {
                setMaLoai("")
                setTenLoai("")
                setEditingId(null)
              }
            } catch (error) {
              Alert.alert("❌ Lỗi", "Không thể xóa!")
            }
          }
        }
      ]
    )
  }

  const handleEdit = (item) => {
    setMaLoai(item.maLoai)
    setTenLoai(item.tenLoai)
    setEditingId(item.id)
  }

  return (
    <ImageBackground
      source={require("../../assets/bg_neon.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.title}>QUẢN LÝ LOẠI CÂU HỎI</Text>

          {/* FORM NHẬP */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Mã Loại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã loại..."
              placeholderTextColor="#aaa"
              value={maLoai}
              onChangeText={setMaLoai}
            />

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

          {/* BUTTONS */}
          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: "#00BFFF" }]}
              onPress={handleSave}
            >
              {isSaving ? <ActivityIndicator color="#00BFFF" /> : (
                <>
                  <Icon name="content-save-outline" size={22} color="#00BFFF" />
                  <Text style={[styles.btnText, { color: "#00BFFF" }]}>
                    {editingId ? "Cập nhật" : "Lưu"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOutline, { borderColor: "#FF3300" }]}
              onPress={() => { setMaLoai(""); setTenLoai(""); setEditingId(null) }}
            >
              <Icon name="trash-can-outline" size={22} color="#FF3300" />
              <Text style={[styles.btnText, { color: "#FF3300" }]}>Xóa</Text>
            </TouchableOpacity>
          </View>

          {/* TIÊU ĐỀ + THANH TÌM KIẾM */}
          <View style={styles.searchRow}>
            <Text style={styles.label}>Danh sách câu hỏi</Text>

            <TextInput
              style={styles.searchBox}
              placeholder="🔍 Tìm..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* DANH SÁCH */}
          <View style={styles.tableContainer}>
            <ScrollView style={{ maxHeight: 500 }}>
              {filteredList.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemText}>{item.maLoai} - {item.tenLoai}</Text>
                  </View>

                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                    <Icon name="pencil-outline" size={26} color="#00BFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id, item.tenLoai)} style={styles.actionBtn}>
                    <Icon name="trash-can-outline" size={26} color="#FF3300" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#00FFFF",
  },
  title: { fontSize: 26, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  formContainer: { width: "100%", marginBottom: 16 },
  label: { color: "#fff", marginBottom: 6, fontSize: 20, fontWeight: "bold" },

  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00FFFF",
    marginBottom: 16
  },

  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },

  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  btnText: { fontSize: 16, fontWeight: "700", marginLeft: 4 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },

  searchBox: {
    width: "55%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "#6e6e6e",
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    color: "#fff"
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: "#00FFFF",
    borderRadius: 16,
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.5)"
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)"
  },

  itemText: { color: "#fff", fontSize: 18 },
  actionBtn: { marginLeft: 12 }
})
