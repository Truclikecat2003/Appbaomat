"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import Toast from 'react-native-toast-message';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { ref, get, update } from "firebase/database"
import { database } from "../firebaseConfig"

const ThongtinScreen = () => {
  const route = useRoute()
  const { userData } = route.params
  const email = userData?.email || ""

  const [userKey, setUserKey] = useState(null)
  const [fullname, setFullname] = useState("")
  const [username, setUsername] = useState("")
  const [dob, setDob] = useState("")
  const [dobInput, setDobInput] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0.8)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!email) return

    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const usersRef = ref(database, "users")
        const snapshot = await get(usersRef)
        if (snapshot.exists()) {
          const usersData = snapshot.val()
          for (const key in usersData) {
            if (usersData[key].email === email) {
              setUserKey(key)
              const data = usersData[key]
              setFullname(data.fullname || "")
              setUsername(data.username || "")
              setDob(data.dob || "")
              setDobInput(data.dob || "")
              setGender(data.gender || "")
              setPhone(data.phone || "")
              setAddress(data.address || "")
              break
            }
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [email])

  const saveDataToFirebase = async () => {
    if (!userKey) return

    try {
      setIsLoading(true)
      await update(ref(database, `users/${userKey}`), {
        fullname,
        dob,
        gender,
        phone,
        address,
      })
    Toast.show({
      type: 'success',
      text1: 'Đăng nhập thành công!',

    });
      setIsEditing(false)
    } catch (error) {
      alert("Lỗi khi lưu thông tin: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEditSave = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    if (isEditing) {
      saveDataToFirebase()
    } else {
      setIsEditing(true)
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

  const handleInputFocus = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const handleInputBlur = () => {
    Animated.timing(opacityAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const handleDobInputChange = (text) => {
    setDobInput(text)

    // Validate DD/MM/YYYY format
    const dateRegex = /^\d{0,2}\/\d{0,2}\/\d{0,4}$/
    if (text === "" || dateRegex.test(text)) {
      // Auto-detect date if user types valid format
      if (text.length === 10) {
        const parts = text.split("/")
        const day = Number.parseInt(parts[0], 10)
        const month = Number.parseInt(parts[1], 10)
        const year = Number.parseInt(parts[2], 10)

        if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
          setDob(text)
        }
      } else if (text === "") {
        setDob("")
      }
    }
  }

  const handleDateConfirm = () => {
    const day = String(selectedDate.getDate()).padStart(2, "0")
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const year = selectedDate.getFullYear()
    const formattedDate = `${day}/${month}/${year}`
    setDob(formattedDate)
    setDobInput(formattedDate)
    setShowDatePicker(false)
  }

  const handleOpenDatePicker = () => {
    if (!isEditing) return

    if (dob) {
      const parts = dob.split("/")
      const date = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
      setSelectedDate(date)
    }
    setShowDatePicker(true)
  }

  const genderOptions = useMemo(() => ["Nam", "Nữ", "Khác"], [])

  if (isLoading && !userKey) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c8ff" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      <View style={styles.headerGlow} />

      <View style={styles.formBox}>
        <View style={styles.titleContainer}>

          <Text style={styles.title}>THÔNG TIN CÁ NHÂN</Text>

        </View>

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>📧 Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
            placeholderTextColor="#4a7c8c"
          />
        </View>

        {/* Full Name Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>👤 Họ và tên</Text>
          <Animated.View style={{ opacity: opacityAnim }}>
            <TextInput
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
              editable={isEditing}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholderTextColor="#4a7c8c"
              maxLength={100}
            />
          </Animated.View>
        </View>

        {/* Username Field - Disabled */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🔐 Tên đăng nhập</Text>
          <Animated.View style={{ opacity: opacityAnim }}>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={username}
              editable={false}
              placeholderTextColor="#4a7c8c"
            />
          </Animated.View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>📅 Ngày sinh</Text>
          <Animated.View style={{ opacity: opacityAnim }}>
            <View style={styles.dateInputWrapper}>
              <TextInput
                style={styles.dateTextInput}
                value={dobInput}
                onChangeText={handleDobInputChange}
                editable={isEditing}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#4a7c8c"
                maxLength={10}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.calendarButton, !isEditing && styles.calendarButtonDisabled]}
                onPress={handleOpenDatePicker}
                disabled={!isEditing}
                activeOpacity={0.7}
              >
                <Text style={styles.calendarIcon}>📆</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Text style={styles.dateHint}>Nhập DD/MM/YYYY hoặc chọn từ lịch</Text>
        </View>

        {/* Gender Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>⚡ Giới tính</Text>
          <View style={styles.genderRow}>
            {genderOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.genderOption, !isEditing && styles.genderOptionDisabled]}
                onPress={() => isEditing && setGender(item)}
                disabled={!isEditing}
                activeOpacity={0.7}
              >
                <View style={[styles.radioCircle, gender === item && styles.radioCircleActive]}>
                  {gender === item && <View style={styles.selectedDot} />}
                </View>
                <Text style={[styles.genderLabel, gender === item && styles.genderLabelActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>📱 Số điện thoại</Text>
          <Animated.View style={{ opacity: opacityAnim }}>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={isEditing}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholderTextColor="#4a7c8c"
              maxLength={20}
            />
          </Animated.View>
        </View>

        {/* Address Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>🏠 Địa chỉ</Text>
          <Animated.View style={{ opacity: opacityAnim }}>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholderTextColor="#4a7c8c"
              maxLength={150}
              multiline
              numberOfLines={2}
            />
          </Animated.View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.button, isEditing ? styles.saveButton : styles.editButton]}
            onPress={toggleEditSave}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#00ff88" size="small" />
            ) : (
              <Text style={styles.buttonText}>{isEditing ? "💾 Lưu" : "✏️ Sửa"}</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerHeader}>
            <TouchableOpacity onPress={() => setShowDatePicker(false)} activeOpacity={0.7}>
              <Text style={styles.datePickerButton}>Hủy</Text>
            </TouchableOpacity>
            <Text style={styles.datePickerTitle}>Chọn ngày sinh</Text>
            <TouchableOpacity onPress={handleDateConfirm} activeOpacity={0.7}>
              <Text style={styles.datePickerButtonConfirm}>Xác nhận</Text>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={selectedDate}
            mode="date"
            maximumDate={new Date()}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              if (date) setSelectedDate(date)
            }}
            style={{ backgroundColor: "#0f1535" }}
          />
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: "#0a0e27",
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e27",
    gap: 12,
  },
  loadingText: {
    color: "#00c8ff",
    fontSize: 14,
    fontWeight: "600",
  },
  headerGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0, 200, 255, 0.05)",
    marginLeft: -150,
  },
  formBox: {
    backgroundColor: "#0f1535",
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.2)",
    shadowColor: "rgba(0, 200, 255, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 200, 255, 0.3)",
  },
  titleIcon: {
    fontSize: 16,
    color: "#00c8ff",
    marginHorizontal: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#05c1f5ff",
    letterSpacing: 1,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 16,
    color: "#00d4ff",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(6, 198, 251, 0.91)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#00ff88",
    fontSize: 15,
    // Nền
    backgroundColor: "rgba(255, 0, 0, 0.05)",
    fontWeight: "500",
  },
  disabledInput: {
    //viền không đổi màu khi disabled
    backgroundColor: "rgba(0, 100, 150, 0.1)",
    //màu chữ khi disabled
    color: "#0783ffff",
  },
  addressInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 200, 255, 0.4)",
    borderRadius: 12,
    backgroundColor: "rgba(0, 200, 255, 0.05)",
    paddingRight: 4,
    gap: 4,
  },
  dateTextInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#00ff88",
    fontSize: 15,
    fontWeight: "500",
  },
  calendarButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.4)",
  },
  calendarButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "rgba(0, 100, 150, 0.1)",
    borderColor: "rgba(0, 100, 150, 0.2)",
  },
  calendarIcon: {
    fontSize: 24,
  },
  dateHint: {
    fontSize: 12,
    color: "#4a7c8c",
    marginTop: 6,
    fontStyle: "italic",
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 39, 0.95)",
    justifyContent: "flex-end",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 200, 255, 0.2)",
    backgroundColor: "#0f1535",
  },
  datePickerButton: {
    fontSize: 16,
    color: "#4a7c8c",
    fontWeight: "600",
  },
  datePickerButtonConfirm: {
    fontSize: 16,
    color: "#00ff88",
    fontWeight: "700",
  },
  datePickerTitle: {
    fontSize: 16,
    color: "#00c8ff",
    fontWeight: "700",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    gap: 12,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(0, 200, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.2)",
  },
  genderOptionDisabled: {
    opacity: 0.6,
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(0, 200, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexShrink: 0,
  },
  radioCircleActive: {
    borderColor: "#00ff88",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00ff88",
  },
  genderLabel: {
    fontSize: 14,
    color: "#4a7c8c",
    fontWeight: "600",
    flex: 1,
  },
  genderLabelActive: {
    color: "#00ff88",
  },
  button: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    elevation: 6,
    justifyContent: "center",
    minHeight: 56,
  },
  editButton: {
    backgroundColor: "rgba(0, 200, 255, 0.15)",
    borderColor: "#00c8ff",
    shadowColor: "rgba(0, 200, 255, 0.5)",
  },
  saveButton: {
    backgroundColor: "rgba(0, 255, 136, 0.15)",
    borderColor: "#00ff88",
    shadowColor: "rgba(0, 255, 136, 0.5)",
  },
  buttonText: {
    color: "#00ff88",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
})

export default ThongtinScreen
