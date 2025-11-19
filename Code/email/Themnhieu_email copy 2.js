"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Modal } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import * as XLSX from "xlsx"
import * as FileSystem from "expo-file-system"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, push, set, get, remove } from "firebase/database"

export default function Themnhieu_email() {
  const [tableData, setTableData] = useState([])
  const [headers, setHeaders] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("vi")
  const [fileName, setFileName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedRecordIds, setSavedRecordIds] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [savedDataPreview, setSavedDataPreview] = useState([])
  const stopRequested = useRef(false)

  // --- Chọn file ---
  const handleFilePick = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input")
        input.type = "file"
        input.accept =
          ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        input.onchange = async (e) => {
          const file = e.target.files[0]
          if (!file) return
          setFileName(file.name)
          const data = await file.arrayBuffer()
          processFile(data, true)
        }
        input.click()
      } else {
        const res = await DocumentPicker.getDocumentAsync({
          type: [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
          ],
        })
        if (res.type !== "success") return
        setFileName(res.name)
        const b64 = await FileSystem.readAsStringAsync(res.uri, {
          encoding: FileSystem.EncodingType.Base64,
        })
        processFile(b64, false, true)
      }
    } catch (err) {
      console.error("Lỗi khi chọn file:", err)
    }
  }

  const processFile = (data, isWeb = false, isBase64 = false) => {
    let workbook
    if (isWeb) workbook = XLSX.read(new Uint8Array(data), { type: "array" })
    else if (isBase64) workbook = XLSX.read(data, { type: "base64" })
    else workbook = XLSX.read(data, { type: "array" })

    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    if (!jsonData.length) return
    setHeaders(jsonData[0])
    setTableData(jsonData.slice(1))
  }

  // --- Lưu Firebase chỉ những dòng mới ---
  const handleSaveToFirebase = async () => {
    if (!tableData.length) return alert("Không có dữ liệu để lưu")
    setIsSaving(true)
    setLoading(true)
    stopRequested.current = false

    try {
      const taskRef = ref(database, `task1_email/${selectedLanguage}`)
      const snapshot = await get(taskRef)
      const existing = snapshot.exists() ? Object.values(snapshot.val()) : []

      const newSavedIds = []
      const newSavedDataPreview = []

      for (let i = 0; i < tableData.length; i++) {
        if (stopRequested.current) break
        const row = tableData[i]
        const dataObj = {}
        headers.forEach((h, idx) => (dataObj[h] = row[idx] ?? ""))

        // Kiểm tra duplicate: nếu tất cả các field trùng thì bỏ qua
        const isDuplicate = existing.some((r) => {
          const keys = Object.keys(dataObj)
          return keys.every((k) => (r[k] ?? "") === dataObj[k])
        })
        if (isDuplicate) continue

        const newRef = push(taskRef)
        await set(newRef, dataObj)
        newSavedIds.push(newRef.key)
        newSavedDataPreview.push(dataObj)
        existing.push(dataObj) // cập nhật mảng existing để tránh duplicate trong cùng 1 batch
      }

      if (newSavedIds.length === 0) alert("✅ Không có dữ liệu mới nào để lưu!")
      else alert(`✅ Đã lưu ${newSavedIds.length} bản ghi mới vào Firebase!`)

      setSavedRecordIds(newSavedIds)
      setSavedDataPreview(newSavedDataPreview)
    } catch (e) {
      console.error(e)
      alert("❌ Lỗi khi lưu Firebase!")
    } finally {
      setIsSaving(false)
      setLoading(false)
    }
  }

  // --- Hủy / Dừng ---
  const handleCancelSave = () => {
    stopRequested.current = true
    setIsSaving(false)
    setLoading(false)
    setTableData([])
    setHeaders([])
    setFileName("")
    setSavedRecordIds([])
    setSavedDataPreview([])
    setShowDeleteConfirm(false)
  }

  const handleDeleteSavedData = async () => {
    if (!savedRecordIds.length) return alert("Không có dữ liệu nào để xóa")
    setLoading(true)
    try {
      for (const id of savedRecordIds) {
        await remove(ref(database, `task1_email/${selectedLanguage}/${id}`))
      }
      alert("✅ Đã xóa tất cả dữ liệu đã lưu từ phiên này!")
      setSavedRecordIds([])
      setSavedDataPreview([])
      setShowDeleteConfirm(false)
    } catch (e) {
      console.error(e)
      alert("❌ Lỗi khi xóa dữ liệu!")
    } finally {
      setLoading(false)
    }
  }

  const languageOptions = {
    vi: { title: "Tải lên Hàng loạt", selectFile: "Chọn File", dragDrop: "Kéo và thả file Email tại đây", support: "Hỗ trợ các định dạng: .CSV, .XLSX" },
    en: { title: "Bulk Upload", selectFile: "Select File", dragDrop: "Drag and drop email files here", support: "Supported formats: .CSV, .XLSX" },
  }
  const lang = languageOptions[selectedLanguage] || languageOptions.vi

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><Icon name="chevron-left" size={24} color="#00D9FF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{lang.title}</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 25 }}>
        <View style={styles.uploadSection}>
          <Icon name="upload" size={48} color="#00D9FF" style={{ marginBottom: 10 }} />
          <Text style={styles.dragDropText}>{lang.dragDrop}</Text>
          <Text style={styles.supportText}>{lang.support}</Text>
          <TouchableOpacity onPress={handleFilePick} style={styles.selectFileButton}>
            <Text style={styles.selectFileButtonText}>{lang.selectFile}</Text>
          </TouchableOpacity>
        </View>

        {fileName ? <Text style={{ color: "#00FF88", marginVertical: 10 }}>File đã chọn: {fileName}</Text> : null}

        {tableData.length > 0 && (
          <ScrollView horizontal style={{ marginBottom: 20 }}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                {headers.map((h, idx) => <Text key={idx} style={styles.headerCell}>{h}</Text>)}
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {tableData.map((row, idx) => (
                  <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlternate]}>
                    {row.map((cell, cidx) => <Text key={cidx} style={styles.cell}>{cell ?? ""}</Text>)}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}

        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
          <TouchableOpacity onPress={handleCancelSave} style={[styles.saveButton, { backgroundColor: "#FF3333" }]}>
            <Icon name="trash-can-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: "#fff", fontWeight: "700" }}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveToFirebase} style={styles.saveButton}>
            <Icon name="database-plus" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text style={{ color: "#000", fontWeight: "700" }}>Lưu Firebase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showDeleteConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Dữ liệu đã thêm trong phiên này</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {savedDataPreview.map((item, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text style={{ color: "#00D9FF", fontWeight: "700" }}>{idx + 1}.</Text>
                  {Object.entries(item).map(([k,v], i) => <Text key={i} style={{ color: "#fff" }}>{k}: {v}</Text>)}
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <TouchableOpacity onPress={() => setShowDeleteConfirm(false)} style={[styles.saveButton, { backgroundColor: "#555" }]}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSavedData} style={[styles.saveButton, { backgroundColor: "#FF6B6B" }]}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Xóa dữ liệu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={{ position: "absolute", top: "50%", left: 0, right: 0, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#00D9FF" />
          <Text style={{ color: "#00D9FF", marginTop: 10 }}>Đang xử lý dữ liệu...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e27" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  headerTitle: { fontSize: 26, fontWeight: "700", color: "#00D9FF", flex: 1 },
  backButton: { padding: 8, borderRadius: 8, backgroundColor: "#252d47", marginRight: 12 },
  uploadSection: { alignItems: "center", padding: 30, backgroundColor: "#1a1f3a", borderRadius: 12, borderWidth: 2, borderColor: "#00D9FF", borderStyle: "dashed", marginBottom: 25 },
  dragDropText: { fontSize: 18, fontWeight: "700", color: "#00D9FF", marginBottom: 8, textAlign: "center" },
  supportText: { fontSize: 14, color: "#7dd3fc", marginBottom: 20 },
  selectFileButton: { backgroundColor: "#00D9FF", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, alignItems: "center" },
  selectFileButtonText: { color: "#0a0e27", fontSize: 16, fontWeight: "700" },
  tableContainer: { backgroundColor: "#1a1f3a", borderRadius: 8, borderWidth: 1, borderColor: "#00D9FF" },
  tableHeader: { flexDirection: "row", backgroundColor: "#00D9FF20", borderBottomWidth: 2, borderColor: "#00D9FF" },
  tableRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "#252d47" },
  tableRowAlternate: { backgroundColor: "#151a2f" },
  headerCell: { width: 150, fontWeight: "700", padding: 10, borderRightWidth: 1, borderColor: "#252d47", color: "#00D9FF" },
  cell: { width: 150, padding: 10, color: "#e0f2fe", borderRightWidth: 1, borderColor: "#252d47" },
  saveButton: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#00FF88", borderRadius: 6 }
})
