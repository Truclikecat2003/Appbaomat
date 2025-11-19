"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Modal } from "react-native"
import * as DocumentPicker from "expo-document-picker"
import * as XLSX from "xlsx"
import * as FileSystem from "expo-file-system"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, push, set, get, remove } from "firebase/database"

// Giả sử bạn có cơ chế lấy thông tin user đăng nhập
// import { useAuth } from "../../contexts/AuthContext"

export default function AD_trungtamhotro() {
  const { user } = useAuth() // user.username sẽ là nguoitao
  const [tableData, setTableData] = useState([])
  const [headers, setHeaders] = useState(["tenCauHoi","loai","cautraloi","giaiphap"])
  const [loaiOptions, setLoaiOptions] = useState([])
  const [fileName, setFileName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedRecordIds, setSavedRecordIds] = useState([])
  const stopRequested = useRef(false)

  useEffect(() => {
    // Lấy các loại câu hỏi từ Firebase
    const fetchLoai = async () => {
      try {
        const snapshot = await get(ref(database, "LoaiCauhoiHotro"))
        if(snapshot.exists()){
          setLoaiOptions(Object.values(snapshot.val()))
        }
      } catch(e){
        console.error("Lỗi lấy loại câu hỏi:", e)
      }
    }
    fetchLoai()
  }, [])

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
    setTableData(jsonData.slice(1))
  }

  const handleSaveToFirebase = async () => {
    if (tableData.length === 0) return alert("Không có dữ liệu để lưu")
    setIsSaving(true)
    setLoading(true)
    stopRequested.current = false
    try {
      const taskRef = ref(database, "TrungTamHotro")
      const snapshot = await get(taskRef)
      const existing = snapshot.exists() ? snapshot.val() : {}
      for (let i = 0; i < tableData.length; i++) {
        if (stopRequested.current) break
        const row = tableData[i]
        const dataObj = {
          idCauHoi: push(ref(database)).key,
          tenCauHoi: row[0] ?? "",
          loai: row[1] ?? "",
          cautraloi: row[2] ?? "",
          giaiphap: row[3] ?? "",
          nguoitao: user?.username ?? "unknown"
        }
        const isDuplicate = Object.values(existing).some(
          (r) => JSON.stringify(r).toLowerCase() === JSON.stringify(dataObj).toLowerCase(),
        )
        if (isDuplicate) continue
        const newRecordRef = push(taskRef)
        await set(newRecordRef, dataObj)
        setSavedRecordIds((prev) => [...prev, newRecordRef.key])
      }
      alert("✅ Lưu thành công!")
      setTableData([])
      setFileName("")
    } catch(e){
      console.error(e)
      alert("❌ Lỗi khi lưu Firebase!")
    } finally {
      setIsSaving(false)
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thêm Câu Hỏi Hỗ Trợ</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <TouchableOpacity onPress={handleFilePick} style={styles.selectFileButton}>
          <Text style={styles.selectFileButtonText}>Chọn File Excel/CSV</Text>
        </TouchableOpacity>
        {fileName ? <Text style={{color:"#0ff", marginVertical:10}}>File đã chọn: {fileName}</Text> : null}

        {tableData.length > 0 && (
          <View style={styles.tableSection}>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeader}>
                  {headers.map((h,i)=>(
                    <Text key={i} style={styles.headerCell}>{h}</Text>
                  ))}
                </View>
                {tableData.map((row,rowIndex)=>(
                  <View key={rowIndex} style={styles.tableRow}>
                    {row.map((cell,idx)=>(
                      <Text key={idx} style={styles.cell}>{cell}</Text>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <TouchableOpacity onPress={handleSaveToFirebase} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu vào Firebase</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#00D9FF" style={{marginTop:20}} />}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0a0e27" },
  scrollContent:{ padding:20 },
  header:{ padding:16, backgroundColor:"#1a1f3a", borderRadius:12, marginBottom:20 },
  headerTitle:{ fontSize:22, fontWeight:"700", color:"#00D9FF" },
  selectFileButton:{ backgroundColor:"#00D9FF", padding:14, borderRadius:8, alignItems:"center" },
  selectFileButtonText:{ color:"#0a0e27", fontWeight:"700" },
  tableSection:{ marginTop:20, borderWidth:1, borderColor:"#00D9FF", borderRadius:8, overflow:"hidden" },
  tableHeader:{ flexDirection:"row", backgroundColor:"#00D9FF20" },
  headerCell:{ padding:8, width:150, fontWeight:"700", color:"#00D9FF" },
  tableRow:{ flexDirection:"row", borderBottomWidth:1, borderColor:"#252d47" },
  cell:{ padding:8, width:150, color:"#fff" },
  saveButton:{ marginTop:20, backgroundColor:"#00FF88", padding:14, borderRadius:8, alignItems:"center" },
  saveButtonText:{ color:"#0a0e27", fontWeight:"700" }
})
