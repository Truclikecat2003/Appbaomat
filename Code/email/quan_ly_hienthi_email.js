"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, FlatList, Modal, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { database } from "../../firebaseConfig"
import { ref, get, set } from "firebase/database"
import { useNavigation } from "@react-navigation/native"

const RichTextEditor = ({ visible, onClose, content, formatting, onSave }) => {
  const [editedText, setEditedText] = useState(content)
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 })
  const [formattingData, setFormattingData] = useState(formatting || {})

  const applyFormatting = (formatType) => {
    if (selectedRange.end <= selectedRange.start) {
      alert("Vui lòng chọn text trước")
      return
    }

    const start = selectedRange.start
    const end = selectedRange.end
    const key = `${start}-${end}`

    setFormattingData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [formatType]: !prev[key]?.[formatType],
      },
    }))
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.editorContainer}>
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color="#00D9FF" />
          </TouchableOpacity>
          <Text style={styles.editorTitle}>Chỉnh sửa định dạng</Text>
          <TouchableOpacity onPress={() => onSave(editedText, formattingData)}>
            <Icon name="check" size={28} color="#00FF88" />
          </TouchableOpacity>
        </View>

        <View style={styles.formattingToolbar}>
          <TouchableOpacity
            onPress={() => applyFormatting("bold")}
            style={styles.formatButton}
          >
            <Icon name="format-bold" size={24} color="#00D9FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyFormatting("italic")}
            style={styles.formatButton}
          >
            <Icon name="format-italic" size={24} color="#00D9FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => applyFormatting("underline")}
            style={styles.formatButton}
          >
            <Icon name="format-underline" size={24} color="#00D9FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditedText(editedText + "\n")
            }}
            style={styles.formatButton}
          >
            <Icon name="format-line-spacing" size={24} color="#00D9FF" />
          </TouchableOpacity>
        </View>

        <TextInput
          value={editedText}
          onChangeText={setEditedText}
          onSelectionChange={(e) => {
            setSelectedRange({
              start: e.nativeEvent.selection.start,
              end: e.nativeEvent.selection.end,
            })
          }}
          multiline
          style={styles.textInput}
          placeholderTextColor="#555"
        />
      </View>
    </Modal>
  )
}

export default function QuanLyHienthiEmail() {
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("vi")
  const [editingId, setEditingId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingFormatting, setEditingFormatting] = useState({})
  const [editorVisible, setEditorVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState("")
  const [columnOrder, setColumnOrder] = useState([])

  useEffect(() => {
    loadData()
  }, [selectedLanguage])

  const loadData = async () => {
    try {
      setLoading(true)
      const taskRef = ref(database, `task1_email/${selectedLanguage}`)
      const columnOrderRef = ref(database, `task1_email/${selectedLanguage}_columnOrder`)
      
      const [snapshot, columnSnapshot] = await Promise.all([
        get(taskRef),
        get(columnOrderRef)
      ])

      if (snapshot.exists()) {
        const records = []
        snapshot.forEach((child) => {
          records.push({
            id: child.key,
            ...child.val(),
          })
        })
        setData(records)
        
        if (columnSnapshot.exists()) {
          setColumnOrder(columnSnapshot.val())
        }
      }
    } catch (err) {
      console.error("Lỗi load data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditFormatting = (id, field, content, formatting) => {
    setEditingId(id)
    setEditingField(field)
    setEditingContent(content)
    setEditingFormatting(formatting || {})
    setEditorVisible(true)
  }

  const handleSaveFormatting = async (newContent, newFormatting) => {
    if (!editingId || !editingField) return

    try {
      const record = data.find((d) => d.id === editingId)
      const recordRef = ref(database, `task1_email/${selectedLanguage}/${editingId}`)
      
      const formattingKey = `${editingField}_formatting`
      const updates = {
        ...record,
        [formattingKey]: newFormatting,
      }
      await set(recordRef, updates)

      loadData()
      setEditorVisible(false)
      alert("✅ Đã lưu định dạng!")
    } catch (err) {
      console.error("Lỗi save:", err)
      alert("❌ Lỗi khi lưu!")
    }
  }

  const getPriorityFields = (item) => {
    const excludeFields = ['id', 'formatting', 'columnOrder']
    const allFields = Object.keys(item).filter(key => 
      !excludeFields.includes(key) && 
      !key.endsWith('_formatting') &&
      typeof item[key] === 'string'
    )
    
    const priorityOrder = ['tieude', 'tiêu đề', 'title', 'email', 'Email']
    const sorted = []
    
    priorityOrder.forEach(priority => {
      const found = allFields.find(f => 
        f.toLowerCase().includes(priority.toLowerCase())
      )
      if (found && !sorted.includes(found)) {
        sorted.push(found)
      }
    })
    
    allFields.forEach(f => {
      if (!sorted.includes(f)) {
        sorted.push(f)
      }
    })
    
    return sorted.slice(0, 2)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#00D9FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản Lý Định Dạng</Text>
        <View style={styles.languageSwitcher}>
          {Object.entries(langOptions).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedLanguage(key)}
              style={[styles.langButton, selectedLanguage === key && styles.langButtonActive]}
            >
              <Text style={[styles.langButtonText, selectedLanguage === key && styles.langButtonTextActive]}>
                {key.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {loading ? (
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>Không có dữ liệu</Text>
        ) : (
          data.map((item, idx) => {
            const displayFields = getPriorityFields(item)
            
            return (
              <View key={item.id} style={styles.dataItem}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemContent}>
                    {displayFields.map((field, fieldIdx) => (
                      <View key={fieldIdx} style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>{field}:</Text>
                        <Text style={styles.itemText} numberOfLines={2}>
                          {item[field]}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleEditFormatting(
                            item.id, 
                            field, 
                            item[field], 
                            item[`${field}_formatting`]
                          )}
                          style={styles.editFieldButton}
                        >
                          <Icon name="pencil" size={16} color="#00D9FF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>

      <RichTextEditor
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        content={editingContent}
        formatting={editingFormatting}
        onSave={handleSaveFormatting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f3a",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#00D9FF",
    marginTop: 25,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00D9FF",
    flex: 1,
    marginLeft: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#252d47",
  },
  languageSwitcher: {
    flexDirection: "row",
    gap: 6,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
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
    fontSize: 11,
    fontWeight: "700",
  },
  langButtonTextActive: {
    color: "#0a0e27",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dataItem: {
    backgroundColor: "#1a1f3a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#252d47",
  },
  itemHeader: {
    flex: 1,
  },
  itemContent: {
    flex: 1,
    gap: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  fieldLabel: {
    color: "#00D9FF",
    fontSize: 12,
    fontWeight: "700",
    minWidth: 60,
  },
  itemText: {
    color: "#e0f2fe",
    fontSize: 14,
    flex: 1,
  },
  editFieldButton: {
    padding: 6,
    backgroundColor: "#252d47",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00D9FF",
  },
  editorContainer: {
    flex: 1,
    backgroundColor: "#1a1f3a",
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderTopColor: "#00D9FF",
  },
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#252d47",
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00D9FF",
  },
  formattingToolbar: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#252d47",
  },
  formatButton: {
    padding: 10,
    backgroundColor: "#252d47",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#00D9FF",
  },
  textInput: {
    flex: 1,
    color: "#e0f2fe",
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },
  loadingText: {
    color: "#7dd3fc",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    fontStyle: "italic",
  },
})

const langOptions = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
  ko: "한국어",
}
