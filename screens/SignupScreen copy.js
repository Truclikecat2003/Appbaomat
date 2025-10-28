import React, { useState } from "react"
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { database } from "../firebaseConfig"
import { ref, get, set, push } from "firebase/database"
import CryptoJS from "crypto-js"

export default function SignupScreen({ navigation }) {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSignup = async () => {
    function cleanText(text) {
      return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

    if (!fullname || !email || !username || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin")
      return
    }

    if (username.length < 6) {
      Alert.alert("Lỗi", "Tên đăng nhập phải có ít nhất 6 ký tự")
      return
    }

    if (username.length > 20) {
      Alert.alert("Lỗi", "Tên người dùng không được quá 20 ký tự")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ")
      return
    }

    const emailUsername = cleanText(email.split("@")[0])
    const passwordClean = cleanText(password)
    const parts = emailUsername.match(/[a-z]+|\d+/g) || []
    for (const part of parts) {
      if (part.length >= 3 && passwordClean.includes(part)) {
        Alert.alert("Lỗi", "Mật khẩu không được chứa phần của tên email")
        return
      }
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận không khớp")
      return
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      Alert.alert("Lỗi", "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt")
      return
    }

    try {
      const emailKey = email.replace(/\./g, ",")
      const usernameKey = username.toLowerCase()

      const emailRef = ref(database, `emails/${emailKey}`)
      const usernameRef = ref(database, `usernames/${usernameKey}`)

      const [emailSnap, usernameSnap] = await Promise.all([get(emailRef), get(usernameRef)])

      if (emailSnap.exists()) {
        Alert.alert("Lỗi", "Email đã được đăng ký")
        return
      }

      if (usernameSnap.exists()) {
        Alert.alert("Lỗi", "Tên đăng nhập đã tồn tại")
        return
      }

      const hashedPassword = CryptoJS.MD5(password).toString()
      const usersRef = ref(database, "users")
      const newUserRef = push(usersRef)

      await Promise.all([
        set(newUserRef, {
          fullname: fullname,
          email: email,
          username: username,
          password: hashedPassword,
          role: "user",
          createdAt: new Date().toISOString(),
        }),
        set(emailRef, true),
        set(usernameRef, true),
      ])

      Alert.alert("Đăng ký thành công!", `Chào mừng ${fullname}!`)
      navigation.navigate("LoginScreen")
    } catch (error) {
      console.error(error)
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký")
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>THANHTRUC</Text>
        <Text style={styles.headerSubtitle}>Create Your Secure Account</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Đăng ký tài khoản</Text>

        {/* Fullname */}
        <View style={styles.inputContainer}>
          <Icon name="id-card" size={20} color="#1e40af" style={styles.icon} />
          <TextInput placeholder="Họ và tên" value={fullname} onChangeText={setFullname} style={styles.input} />
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#1e40af" style={styles.icon} />
          <TextInput placeholder="Tên đăng nhập" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#1e40af" style={styles.icon} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#1e40af" style={styles.icon} />
          <TextInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.input} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye-slash" : "eye"} size={18} color="#1e40af" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#1e40af" style={styles.icon} />
          <TextInput
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon name={showConfirmPassword ? "eye-slash" : "eye"} size={18} color="#1e40af" />
          </TouchableOpacity>
        </View>

        {/* Button */}
        <View style={styles.signupRow}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>

        {/* Login link */}
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginText}>
            Đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 THANHTRUC. All rights reserved.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", justifyContent: "space-between", paddingVertical: 20 },
  header: { alignItems: "center", paddingTop: 40, paddingBottom: 10 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e40af",
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: "rgba(30, 64, 175, 0.2)",
    textShadowRadius: 4,
  },
  headerSubtitle: { fontSize: 16, color: "#475569", letterSpacing: 1, fontWeight: "500" },
  formContainer: { paddingHorizontal: 24, paddingVertical: 20 },
  formTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: 24,
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "rgba(30,64,175,0.25)",
    textShadowRadius: 6,
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
    elevation: 5,
    marginBottom: 15,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, height: 54, color: "#1e293b", fontSize: 16, fontWeight: "500" },
  eyeIcon: { padding: 10, marginLeft: 8 },
  signupRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 14, gap: 12 },
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
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700", textTransform: "uppercase" },
  loginText: { marginTop: 20, fontSize: 14, color: "#475569", textAlign: "center", fontWeight: "500" },
  loginLink: { color: "#1e40af", fontWeight: "700" },
  footer: { alignItems: "center", paddingBottom: 20 },
  footerText: { fontSize: 11, color: "#94a3b8", letterSpacing: 0.3 },
})
