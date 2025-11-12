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
  const [fileType, setFileType] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedRecordIds, setSavedRecordIds] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [savedDataPreview, setSavedDataPreview] = useState([])
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const stopRequested = useRef(false)

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
    if (isWeb) {
      const arr = new Uint8Array(data)
      workbook = XLSX.read(arr, { type: "array" })
    } else if (isBase64) {
      workbook = XLSX.read(data, { type: "base64" })
    } else {
      workbook = XLSX.read(data, { type: "array" })
    }

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    if (jsonData.length === 0) return

    setHeaders(jsonData[0])
    setTableData(jsonData.slice(1))

    const flat = jsonData.flat()
    const isEmail = flat.some((val) => typeof val === "string" && val.includes("@"))
    setFileType(isEmail ? "email" : "message")
  }

  const handleSaveToFirebase = async () => {
    if (tableData.length === 0) return alert("Không có dữ liệu để lưu")
    setIsSaving(true)
    setLoading(true)
    stopRequested.current = false

    try {
      const taskRef = ref(database, `task1_email/${selectedLanguage}`)
      const snapshot = await get(taskRef)
      const existing = snapshot.exists() ? snapshot.val() : {}

      for (let i = currentIndex; i < tableData.length; i++) {
        if (stopRequested.current) break

        const row = tableData[i]
        const dataObj = {}
        headers.forEach((h, idx) => (dataObj[h] = row[idx] ?? ""))

        const isDuplicate = Object.values(existing).some(
          (r) => JSON.stringify(r).toLowerCase() === JSON.stringify(dataObj).toLowerCase(),
        )
        if (isDuplicate) continue

        const newRecordRef = push(taskRef)
        await set(newRecordRef, dataObj)
        setSavedRecordIds((prev) => [...prev, newRecordRef.key])
        setSavedDataPreview((prev) => [...prev, dataObj])

        setCurrentIndex(i + 1)
      }

      if (!stopRequested.current) {
        alert("✅ Đã lưu xong toàn bộ dữ liệu!")
        setCurrentIndex(0)
      }
    } catch (e) {
      console.error(e)
      alert("❌ Lỗi khi lưu Firebase!")
    } finally {
      setIsSaving(false)
      setLoading(false)
    }
  }

  const handleDeleteSavedData = async () => {
    if (savedRecordIds.length === 0) {
      alert("Không có dữ liệu nào để xóa")
      return
    }

    try {
      setLoading(true)
      for (const recordId of savedRecordIds) {
        const recordRef = ref(database, `task1_email/${selectedLanguage}/${recordId}`)
        await remove(recordRef)
      }

      alert("✅ Đã xóa tất cả dữ liệu đã lưu từ phiên này!")
      setSavedRecordIds([])
      setSavedDataPreview([])
      setShowDeleteConfirm(false)
      setIsSaving(false)
    } catch (e) {
      console.error(e)
      alert("❌ Lỗi khi xóa dữ liệu!")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSave = () => {
    stopRequested.current = true
    setIsSaving(false)
    setLoading(false)
    setCurrentIndex(0)
    setTableData([])
    setHeaders([])
    setFileName("")
    setSavedRecordIds([])
    setSavedDataPreview([])
    setShowDeleteConfirm(false)
    setFileType(null)
  }

  const handleStopSaving = () => {
    stopRequested.current = true
    setShowDeleteConfirm(true)
  }

  const languageOptions = {
    vi: {
      title: "Tải lên Hàng loạt",
      selectFile: "Chọn File",
      dragDrop: "Kéo và thả file Email tại đây",
      support: "Hỗ trợ các định dạng: .CSV, .XLSX",
      selectLanguage: "Chọn ngôn ngữ lưu:",
      vietnamese: "Tiếng Việt",
      english: "Tiếng Anh",
      chinese: "Tiếng Trung",
      korean: "Tiếng Hàn",
    },
    en: {
      title: "Bulk Upload",
      selectFile: "Select File",
      dragDrop: "Drag and drop email files here",
      support: "Supported formats: .CSV, .XLSX",
      selectLanguage: "Select language to save:",
      vietnamese: "Vietnamese",
      english: "English",
      chinese: "Chinese",
      korean: "Korean",
    },
    zh: {
      title: "批量上传",
      selectFile: "选择文件",
      dragDrop: "拖放电子邮件文件到这里",
      support: "支持格式: .CSV, .XLSX",
      selectLanguage: "选择保存语言:",
      vietnamese: "越南语",
      english: "英语",
      chinese: "中文",
      korean: "韩语",
    },
    ko: {
      title: "일괄 업로드",
      selectFile: "파일 선택",
      dragDrop: "여기에 이메일 파일을 끌어다놓으세요",
      support: "지원 형식: .CSV, .XLSX",
      selectLanguage: "저장할 언어 선택:",
      vietnamese: "베트남어",
      english: "영어",
      chinese: "중국어",
      korean: "한국어",
    },
  }

  const lang = languageOptions[selectedLanguage] || languageOptions.vi

  const scrollViewStyle =
    Platform.OS === "web"
      ? { ...styles.scrollContent, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }
      : styles.scrollContent

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#00D9FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lang.title}</Text>

        <View style={styles.languageSwitcher}>
          <TouchableOpacity
            onPress={() => setSelectedLanguage("vi")}
            style={[styles.langButton, selectedLanguage === "vi" && styles.langButtonActive]}
          >
            <Text style={[styles.langButtonText, selectedLanguage === "vi" && styles.langButtonTextActive]}>VN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage("en")}
            style={[styles.langButton, selectedLanguage === "en" && styles.langButtonActive]}
          >
            <Text style={[styles.langButtonText, selectedLanguage === "en" && styles.langButtonTextActive]}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage("zh")}
            style={[styles.langButton, selectedLanguage === "zh" && styles.langButtonActive]}
          >
            <Text style={[styles.langButtonText, selectedLanguage === "zh" && styles.langButtonTextActive]}>中文</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage("ko")}
            style={[styles.langButton, selectedLanguage === "ko" && styles.langButtonActive]}
          >
            <Text style={[styles.langButtonText, selectedLanguage === "ko" && styles.langButtonTextActive]}>한국</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={scrollViewStyle}
        showsVerticalScrollIndicator={true}
        {...(Platform.OS === "web" && {
          contentContainerStyle: { flexGrow: 1 },
          nestedScrollEnabled: true,
        })}
      >
        <View style={styles.uploadSection}>
          <View style={styles.dragDropZone}>
            <Icon name="upload" size={48} color="#00D9FF" />
          </View>
          <Text style={styles.dragDropText}>{lang.dragDrop}</Text>
          <Text style={styles.supportText}>{lang.support}</Text>

          <TouchableOpacity onPress={handleFilePick} style={styles.selectFileButton}>
            <Text style={styles.selectFileButtonText}>{lang.selectFile}</Text>
          </TouchableOpacity>
        </View>

        {fileName && (
          <View style={styles.fileNameSection}>
            <Icon name="file-document" size={18} color="#00FF88" style={{ marginRight: 10 }} />
            <Text style={styles.fileNameText}>File đã chọn: {fileName}</Text>
          </View>
        )}

        {tableData.length > 0 && (
          <View style={styles.tableSection}>
            <ScrollView horizontal style={styles.tableWrapper}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  {headers.map((header, index) => (
                    <Text key={index} style={styles.headerCell}>
                      {header}
                    </Text>
                  ))}
                </View>

                <ScrollView style={styles.tableBodyScroll}>
                  {tableData.map((row, rowIndex) => (
                    <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 && styles.tableRowAlternate]}>
                      {row.map((cell, cellIndex) => (
                        <Text key={cellIndex} style={styles.cell}>
                          {cell !== undefined ? String(cell) : ""}
                        </Text>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}

        {tableData.length === 0 && <Text style={styles.emptyText}>Chưa có dữ liệu để hiển thị</Text>}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.buttonContainerFixed}>
        <TouchableOpacity onPress={isSaving ? handleStopSaving : handleCancelSave} style={styles.cancelSaveButton}>
          <Icon name="trash-can-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.cancelSaveButtonText}>{isSaving ? "Dừng thêm" : "Hủy"}</Text>
        </TouchableOpacity>

        {!isSaving && (
          <TouchableOpacity onPress={handleSaveToFirebase} style={styles.saveButton}>
            <Icon name="database-plus" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.saveButtonText}>Lưu Firebase</Text>
          </TouchableOpacity>
        )}

        {isSaving && (
          <TouchableOpacity style={[styles.saveButton, styles.disabledButton]} disabled>
            <Icon name="database-plus" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.saveButtonText}>Lưu Firebase</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showDeleteConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Dữ liệu đã thêm trong phiên này</Text>
            <Text style={styles.modalSubtitle}>Tổng số: {savedDataPreview.length} bản ghi</Text>

            <ScrollView style={styles.modalDataList}>
              {savedDataPreview.map((item, idx) => (
                <View key={idx} style={styles.modalDataItem}>
                  <Text style={styles.modalDataIndex}>{idx + 1}.</Text>
                  <View style={styles.modalDataContent}>
                    {Object.entries(item).map(([key, value], i) => (
                      <Text key={i} style={styles.modalDataText}>
                        {key}: {String(value)}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={() => setShowDeleteConfirm(false)} style={styles.modalCancelButton}>
                <Icon name="close-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.modalButtonText}>Hủy bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteSavedData} style={styles.modalDeleteButton}>
                <Icon name="delete-forever" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.modalButtonText}>Xóa dữ liệu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00D9FF" />
          <Text style={{ color: "#00D9FF", marginTop: 10 }}>Đang xử lý dữ liệu...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },
  scrollContent: {
    flex: 1,
    padding: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#1a1f3a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00D9FF",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 25,
    marginHorizontal: 25,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#00D9FF",
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#252d47",
  },
  languageSwitcher: {
    flexDirection: "row",
    gap: 8,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#252d47",
    borderWidth: 1,
    borderColor: "#00D9FF",
  },
  langButtonActive: {
    backgroundColor: "#00D9FF",
  },
  langButtonText: {
    color: "#00D9FF",
    fontSize: 12,
    fontWeight: "700",
  },
  langButtonTextActive: {
    color: "#0a0e27",
  },
  uploadSection: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#1a1f3a",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00D9FF",
    borderStyle: "dashed",
    marginBottom: 25,
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  dragDropZone: {
    backgroundColor: "#252d47",
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#00D9FF",
  },
  dragDropText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00D9FF",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  supportText: {
    fontSize: 14,
    color: "#7dd3fc",
    marginBottom: 20,
    fontWeight: "500",
  },
  selectFileButton: {
    backgroundColor: "#00D9FF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00B8D4",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  selectFileButtonText: {
    color: "#0a0e27",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  fileNameSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f3a",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00FF88",
    marginBottom: 20,
  },
  fileNameText: {
    color: "#00FF88",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  tableSection: {
    backgroundColor: "#1a1f3a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00D9FF",
    overflow: "hidden",
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    paddingBottom: 20,
    marginBottom: 15,
  },
  tableWrapper: {
    flexGrow: 1,
  },
  tableContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1a1f3a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00D9FF20",
    borderBottomWidth: 2,
    borderColor: "#00D9FF",
  },
  tableBodyScroll: {
    maxHeight: 500,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#252d47",
  },
  tableRowAlternate: {
    backgroundColor: "#151a2f",
  },
  headerCell: {
    width: 150,
    fontWeight: "700",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: "#252d47",
    color: "#00D9FF",
    fontSize: 15,
    textAlign: "left",
    backgroundColor: "#1e2545",
  },
  cell: {
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#e0f2fe",
    fontSize: 14,
    textAlign: "left",
    borderRightWidth: 1,
    borderColor: "#252d47",
  },
  buttonContainerFixed: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "#0a0e27",
    borderTopWidth: 1,
    borderTopColor: "#252d47",
  },
  cancelSaveButton: {
    backgroundColor: "#FF3333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#CC2222",
    shadowColor: "#FF3333",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: "#00FF88",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#00CC6E",
    shadowColor: "#00FF88",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#0a0e27",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cancelSaveButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  disabledButton: { opacity: 0.5 },
  loading: { alignItems: "center", marginVertical: 20 },
  emptyText: {
    marginTop: 30,
    color: "#64748b",
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1a1f3a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
    borderTopWidth: 2,
    borderColor: "#00D9FF",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00D9FF",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#7dd3fc",
    marginBottom: 16,
  },
  modalDataList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  modalDataItem: {
    flexDirection: "row",
    backgroundColor: "#252d47",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderColor: "#00D9FF",
  },
  modalDataIndex: {
    color: "#00D9FF",
    fontWeight: "700",
    marginRight: 12,
    fontSize: 14,
  },
  modalDataContent: {
    flex: 1,
  },
  modalDataText: {
    color: "#e0f2fe",
    fontSize: 12,
    marginBottom: 4,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#555555",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#666666",
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#FF5252",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
})
