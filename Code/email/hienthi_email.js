"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, get } from "firebase/database"
import { RichTextDisplay } from "./rich-text-display"

// Helper function để render formatted text (in đậm, in nghiêng, xuống dòng)
const renderFormattedText = (text) => {
  if (!text) return []
  
  const parts = []
  let lastIndex = 0
  const regex = /\*\*(.*?)\*\*|\*(.*?)\*|\\n/g
  let match

  while ((match = regex.exec(text)) !== null) {
    // Thêm text bình thường trước match
    if (match.index > lastIndex) {
      parts.push({ type: "normal", text: text.substring(lastIndex, match.index) })
    }
    
    // Thêm match
    if (match[1] !== undefined) {
      parts.push({ type: "bold", text: match[1] })
    } else if (match[2] !== undefined) {
      parts.push({ type: "italic", text: match[2] })
    } else if (match[0] === "\\n") {
      parts.push({ type: "linebreak" })
    }
    
    lastIndex = regex.lastIndex
  }
  
  // Thêm text còn lại
  if (lastIndex < text.length) {
    parts.push({ type: "normal", text: text.substring(lastIndex) })
  }
  
  return parts.length > 0 ? parts : [{ type: "normal", text }]
}

export default function HienthiEmail() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [columnOrder, setColumnOrder] = useState([]) // Lưu thứ tự cột
  const [columnMapping, setColumnMapping] = useState({}) // Map: tên gốc -> tên sanitized
  const [selectedLanguage, setSelectedLanguage] = useState("vi")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDataFromFirebase()
  }, [selectedLanguage])

  const loadDataFromFirebase = async () => {
    try {
      setLoading(true)
      const taskRef = ref(database, `task1_email/${selectedLanguage}`)
      const columnOrderRef = ref(database, `task1_email/${selectedLanguage}_columnOrder`)
      const columnMappingRef = ref(database, `task1_email/${selectedLanguage}_columnMapping`)
      
      const [snapshot, columnSnapshot, mappingSnapshot] = await Promise.all([
        get(taskRef),
        get(columnOrderRef),
        get(columnMappingRef)
      ])
      
      if (snapshot.exists()) {
        const records = []
        snapshot.forEach((child) => {
          records.push({
            _firebaseKey: child.key,
            ...child.val(),
          })
        })
        setData(records)
        
        if (columnSnapshot.exists()) {
          const originalColumnOrder = columnSnapshot.val()
          setColumnOrder(originalColumnOrder)
          setHeaders(originalColumnOrder)
        }
        
        if (mappingSnapshot.exists()) {
          setColumnMapping(mappingSnapshot.val())
        }
        
        // Fallback nếu không có columnOrder
        if (!columnSnapshot.exists() && records.length > 0) {
          const firstRecord = records[0]
          const autoHeaders = Object.keys(firstRecord).filter(key => 
            !key.startsWith('_') && 
            !key.endsWith('_formatting')
          )
          setHeaders(autoHeaders)
          setColumnOrder(autoHeaders)
        }
      } else {
        setData([])
        setHeaders([])
        setColumnOrder([])
        setColumnMapping({})
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error)
    } finally {
      setLoading(false)
    }
  }

  const languageOptions = {
    vi: { title: "Hiển thị Email", empty: "Chưa có dữ liệu" },
    en: { title: "Display Email", empty: "No data available" },
    zh: { title: "显示电子邮件", empty: "暂无数据" },
    ko: { title: "이메일 표시", empty: "데이터 없음" },
  }
  const lang = languageOptions[selectedLanguage] || languageOptions.vi

  const getCellValue = (row, originalColumnName) => {
    // Thử lấy trực tiếp từ tên gốc
    if (row[originalColumnName] !== undefined) {
      return row[originalColumnName]
    }
    
    // Nếu không có, dùng mapping để tìm key sanitized
    const sanitizedKey = columnMapping[originalColumnName]
    if (sanitizedKey && row[sanitizedKey] !== undefined) {
      return row[sanitizedKey]
    }
    
    return ""
  }

  const renderCell = (value, originalColumnName, rowData) => {
    // Tìm key sanitized cho formatting
    const sanitizedKey = columnMapping[originalColumnName] || originalColumnName
    const formattingKey = `${sanitizedKey}_formatting`
    const formatting = rowData?.[formattingKey]
    
    if (formatting && Object.keys(formatting).length > 0) {
      return (
        <View style={styles.cellContent}>
          <RichTextDisplay content={String(value ?? "")} formatting={formatting} />
        </View>
      )
    }
    
    const textContent = String(value ?? "")
    
    return (
      <View style={styles.cellContent}>
        <Text style={styles.cell}>
          {textContent}
        </Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00D9FF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

      {data.length > 0 && columnOrder.length > 3 && (
        <View style={styles.scrollHint}>
          <Icon name="arrow-left-right" size={16} color="#00D9FF" />
          <Text style={styles.scrollHintText}>Kéo sang ngang để xem thêm cột</Text>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        {data.length === 0 ? (
          <Text style={styles.emptyText}>{lang.empty}</Text>
        ) : (
          <View style={styles.tableContainer}>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={Platform.OS === 'web'}
              persistentScrollbar={true}
            >
              <View>
                {/* Header - Hiển thị tên cột gốc */}
                <View style={styles.tableHeader}>
                  {columnOrder.map((originalColumnName, idx) => (
                    <Text key={idx} style={styles.headerCell}>
                      {originalColumnName}
                    </Text>
                  ))}
                </View>

                {/* Rows - Lấy data từ key sanitized */}
                {data.map((row, rowIdx) => (
                  <View key={rowIdx} style={[styles.tableRow, rowIdx % 2 === 0 && styles.tableRowAlternate]}>
                    {columnOrder.map((originalColumnName, cellIdx) => {
                      const cellValue = getCellValue(row, originalColumnName)
                      return (
                        <View key={cellIdx} style={styles.cellWrapper}>
                          {renderCell(cellValue, originalColumnName, row)}
                        </View>
                      )
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Căn trái thay vì space-between
    backgroundColor: "#1a1f3a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00D9FF",
    marginTop: 25,
    marginHorizontal: 25,
    marginBottom: 20,
    shadowColor: "#00D9FF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#00D9FF",
    flex: 1, // Để title chiếm space, đẩy language switcher sang phải
    textAlign: "left", // Căn trái
  },
  languageSwitcher: {
    flexDirection: "row",
    gap: 8,
  },
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1f3a",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 25,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00D9FF",
    gap: 8,
  },
  scrollHintText: {
    color: "#00D9FF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 140px)',
    }),
  },
  tableContainer: {
    backgroundColor: "#1a1f3a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00D9FF",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00D9FF20",
    borderBottomWidth: 2,
    borderColor: "#00D9FF",
  },
  tableRow: {
    flexDirection: "row",
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
  cellWrapper: {
    width: 150,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: "#252d47",
    minHeight: 50,
    justifyContent: "flex-start",
  },
  cellContent: {
    width: "100%",
  },
  cell: {
    color: "#e0f2fe",
    fontSize: 14,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
})
