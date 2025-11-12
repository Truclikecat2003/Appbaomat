import React, { useState } from "react"
import { View, TextInput, Button, Text, Alert } from "react-native"
import { auth } from "../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function TestDangNhap({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dangNhap = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      if (user.emailVerified) {
        Alert.alert("Thành công", "Đăng nhập thành công")
        navigation.navigate("HomeScreen")
      } else {
        Alert.alert("Chưa xác nhận", "Vui lòng xác nhận email trước khi đăng nhập")
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Đăng nhập" onPress={dangNhap} />
    </View>
  )
}
