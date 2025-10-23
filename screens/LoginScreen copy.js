"use client"
import { ActivityIndicator } from "react-native"
import { useState, useLayoutEffect, useEffect, useRef } from "react"
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Animated, Easing } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { database } from "../firebaseConfig"
import { ref, get, update } from "firebase/database"
import CryptoJS from "crypto-js"
import GearLoader from "../components/GearLoader"

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const fadeInValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [])

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu")
      return
    }

    setLoading(true)

    try {
      const usernameKey = username.toLowerCase()
      const usernameRef = ref(database, `usernames/${usernameKey}`)

      const usernameSnap = await get(usernameRef)
      if (!usernameSnap.exists()) {
        setLoading(false)
        Alert.alert("Lỗi", "Tên đăng nhập không tồn tại")
        return
      }

      const usersRef = ref(database, "users")
      const usersSnap = await get(usersRef)

      let userKey = null
      let userData = null

      const users = usersSnap.val()
      for (const [key, value] of Object.entries(users)) {
        if (value.username.toLowerCase() === usernameKey) {
          userKey = key
          userData = value
          break
        }
      }

      if (!userData) {
        setLoading(false)
        Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng")
        return
      }

      const hashedPassword = CryptoJS.MD5(password).toString()

      if (userData.password !== hashedPassword) {
        setLoading(false)
        Alert.alert("Lỗi", "Mật khẩu không đúng")
        return
      }

      update(ref(database, `users/${userKey}`), {
        lastLogin: new Date().toISOString(),
      }).catch(() => {})

      setLoading(false)

      if (userData.role === "admin") {
        Alert.alert("Chào mừng Admin", `Xin chào ${userData.username}`)
        navigation.navigate("AdminScreen", { username: userData.username })
      } else {
        Alert.alert("Đăng nhập thành công!", `Xin chào ${userData.username}`)
        navigation.navigate("HomeScreen", { username: userData.username })
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      Alert.alert("Lỗi", "Không thể đăng nhập, vui lòng thử lại")
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft: () => null, title: "Login" })
  }, [navigation])

  return (
    <Animated.View style={[styles.container, { opacity: fadeInValue }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THANHTRUC</Text>
        <Text style={styles.headerSubtitle}>Security For Me</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Đăng nhập</Text>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Icon name="user" size={18} color="#1e40af" style={styles.icon} />
            <TextInput
              placeholder="Tên đăng nhập"
              placeholderTextColor="#7a8ba8"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={18} color="#1e40af" style={styles.icon} />
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#7a8ba8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              editable={!loading}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <Icon name={showPassword ? "eye-slash" : "eye"} size={18} color="#1e40af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text style={[styles.buttonText, { color: "#0a0e27" }]}>Đang tải...</Text>
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")} disabled={loading}>
          <Text style={styles.signupText}>
            Chưa có tài khoản? <Text style={styles.signupLink}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 THANHTRUC. All rights reserved.</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e40af",
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: "rgba(30, 64, 175, 0.2)",
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#475569",
    letterSpacing: 1,
    fontWeight: "500",
    fontFamily: "System", // hoặc font custom, ví dụ: 'Poppins-Regular'
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
    color: "#1e40af",
  },
  input: {
    flex: 1,
    height: 54,
    color: "#1e293b",
    fontSize: 16,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 10,
    marginLeft: 8,
  },
  button: {
  width: "70%",                    // thu chiều ngang cho cân đối
  alignSelf: "center",             // căn giữa nút
  paddingVertical: 10,             // giảm chiều cao
  backgroundColor: "#1e40af",      // xanh đậm sang trọng
  borderRadius: 10,                // bo vừa phải
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
  shadowColor: "#1e3a8a",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 2,                    // nhẹ thôi để tự nhiên
},
buttonText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
  letterSpacing: 0.4,
  textTransform: "uppercase",      // chữ in hoa nhẹ nhìn chuyên nghiệp
},
buttonDisabled: {
  backgroundColor: "#9ca3af",      // xám tinh tế khi disabled
  opacity: 0.8,
},

  signupText: {
    marginTop: 18,
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    fontWeight: "500",
  },
  signupLink: {
    color: "#1e40af",
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: "#94a3b8",
    letterSpacing: 0.3,
  },
})
