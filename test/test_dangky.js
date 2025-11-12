"use client"
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/FontAwesome"
import { auth, database } from "../firebaseConfig"
import { ref, set } from "firebase/database"
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth"

export default function TestDangKy({ navigation }) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!email || !password || !username) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ email, tên đăng nhập và mật khẩu")
      return
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await sendEmailVerification(user)
      await set(ref(database, "users/" + user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
        verified: false,
      })

      Alert.alert("Xác thực email", "Vui lòng kiểm tra hộp thư để xác minh tài khoản.")
      setLoading(false)
    } catch (err) {
      Alert.alert("Lỗi", err.message)
      setLoading(false)
    }
  }

  // theo dõi khi xác thực xong thì chuyển login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        const userRef = ref(database, "users/" + user.uid)
        set(userRef, { verified: true }, { merge: true })
        navigation.replace("TestDangNhap")
      }
    })
    return unsubscribe
  }, [])

  return (
    <LinearGradient colors={["#000814", "#001428", "#0a0e27"]} style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

      <View style={styles.inputRow}>
        <Icon name="user" color="#00F0FF" size={18} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Tên đăng nhập"
          placeholderTextColor="#4A9FB5"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputRow}>
        <Icon name="envelope" color="#00F0FF" size={18} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#4A9FB5"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputRow}>
        <Icon name="lock" color="#00F0FF" size={18} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Mật khẩu"
          placeholderTextColor="#4A9FB5"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Đang tạo..." : "Đăng ký"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("TestDangNhap")}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#00FF88", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#00F0FF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "85%",
    height: 50,
    marginBottom: 12,
  },
  input: { flex: 1, color: "#E0FFFF" },
  btn: {
    backgroundColor: "#00F0FF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#001428", fontWeight: "900", letterSpacing: 1.2 },
  link: { color: "#4A9FB5", marginTop: 16 },
})
