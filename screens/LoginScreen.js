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
            <Icon name="user" size={20} color="#1e40af" style={styles.icon} />
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
            <Icon name="lock" size={20} color="#1e40af" style={styles.icon} />
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

        {/* Shield + Button Row */}
        <View style={styles.loginRow}>
          <Icon name="shield" size={45} color="#1e40af" />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Đang tải..." : "Đăng nhập"}</Text>
          </TouchableOpacity>
          <Icon name="shield" size={45} color="#1e40af" />
        </View>

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
    fontFamily: "System",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  formTitle: {
    fontSize: 28, // chữ đăng nhập to hơn
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 30,
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "rgba(30,64,175,0.25)",
    textShadowRadius: 6,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#b0c4de",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5, // hiệu ứng nổi 3D
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
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    gap: 12,
  },
  button: {
    width: "60%",
    paddingVertical: 12,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // chữ trong nút to hơn
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.8,
  },
  signupText: {
    marginTop: 20,
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
