"use client"
import { useState, useRef, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { LinearGradient } from "expo-linear-gradient"
import { auth, database } from "../firebaseConfig"
import { sendPasswordResetEmail } from "firebase/auth"
import { get, ref } from "firebase/database"
import styles from "../style/style_Quenmatkhau"

const { width, height } = Dimensions.get("window")

export default function QuenMatKhauScreen({ navigation, route }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  const master = useRef(new Animated.Value(0)).current
  const scan = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const laser = useRef(new Animated.Value(0)).current
  const glitch = useRef(new Animated.Value(0)).current
  const buttonPress = useRef(new Animated.Value(0)).current

  const PARTICLE_COUNT = 150
  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = Math.random() * 30 + 5
      const size = Math.random() * 3 + 0.6
      const speed = Math.random() * 0.6 + 0.1
      const txMax = (Math.cos(speed * 7 + (i % 7)) * radius) / 1.2
      const tyMax = (Math.sin(speed * 5 + (i % 5)) * radius) / 1.2
      arr.push({
        id: i,
        cx: Math.random() * width,
        cy: Math.random() * height,
        size,
        alpha: Math.random() * 0.8 + 0.2,
        speed,
        txMax,
        tyMax,
        hue: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#FF00FF" : "#00FF88",
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const loops = []
    loops.push(
      Animated.loop(
        Animated.timing(master, {
          toValue: 1,
          duration: 14000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ),
    )
    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(scan, { toValue: 1, duration: 4500, easing: Easing.linear, useNativeDriver: false }),
          Animated.timing(scan, { toValue: 0, duration: 4500, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ),
    )
    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
      ),
    )
    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(laser, {
            toValue: 1,
            duration: 3200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(laser, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
      ),
    )
    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(glitch, { toValue: 1, duration: 7500, easing: Easing.linear, useNativeDriver: false }),
          Animated.timing(glitch, { toValue: 0, duration: 7500, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ),
    )

    loops.forEach((a) => a.start())
    return () => loops.forEach((a) => a.stop?.())
  }, [])

  useEffect(() => {
    if (route?.params?.userEmail) setEmail(route.params.userEmail)
    else if (route?.params?.username) loadEmailFromUsername(route.params.username)
  }, [route?.params])

  // --- Lấy email từ username (nếu được truyền từ trang khác)
  const loadEmailFromUsername = async (username) => {
    try {
      const usersRef = ref(database, "users")
      const snap = await get(usersRef)
      const users = snap.val() || {}
      for (const key in users) {
        if (users[key].username?.toLowerCase() === username.toLowerCase()) {
          setEmail(users[key].email || "")
          break
        }
      }
    } catch (err) {
      console.log("Lỗi load email:", err.message)
    }
  }

  // --- LOGIC CHÍNH: Gửi email khôi phục (có kiểm tra trong database)
  const handleSendResetEmail = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("Lỗi", "Vui lòng nhập email hợp lệ.")
      return
    }
    setLoading(true)
    try {
      const usersRef = ref(database, "users")
      const snap = await get(usersRef)
      const users = snap.val() || {}

      const foundUser = Object.values(users).find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      )

      if (!foundUser) {
        setLoading(false)
        Alert.alert("Lỗi", "Email không tồn tại trong hệ thống.")
        return
      }

      await sendPasswordResetEmail(auth, email)
      Animated.sequence([
        Animated.timing(buttonPress, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(buttonPress, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start()

      setLoading(false)
      Alert.alert("Thành công", `Email khôi phục mật khẩu đã được gửi đến ${email}.`)

      setTimeout(() => {
        navigation.navigate("DoiMatKhauScreen", { email })
      }, 800)
    } catch (err) {
      console.error("Lỗi khi gửi email reset:", err)
      if (err.code === "auth/user-not-found") {
        Alert.alert("Lỗi", "Email chưa được đăng ký trong hệ thống.")
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Lỗi", "Địa chỉ email không hợp lệ.")
      } else {
        Alert.alert("Lỗi", err.message || "Không thể gửi email reset.")
      }
    } finally {
      setLoading(false)
    }
  }

  const scanY = scan.interpolate({ inputRange: [0, 1], outputRange: [-height * 0.7, height * 0.7] })
  const pulseBorderColor = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["rgba(0,240,255,0.15)", "rgba(0,240,255,0.95)", "rgba(0,240,255,0.15)"],
  })
  const laserOpacity = laser.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.35] })
  const glitchOffset = glitch.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 3, -2, 2, 0],
  })
  const buttonScale = buttonPress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] })

  const renderParticles = () => {
    return particles.map((p) => {
      const tx = master.interpolate({ inputRange: [0, 1], outputRange: [0, p.txMax] })
      const ty = master.interpolate({ inputRange: [0, 1], outputRange: [0, p.tyMax] })
      return (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              width: p.size,
              height: p.size,
              left: p.cx,
              top: p.cy,
              transform: [{ translateX: tx }, { translateY: ty }],
              backgroundColor: p.hue,
              opacity: p.alpha,
              shadowColor: p.hue,
            },
          ]}
        />
      )
    })
  }

  return (
    <LinearGradient colors={["#000814", "#001428", "#0a0e27"]} style={styles.container}>
      <View style={styles.gridLayer}>
        {[...Array(Math.ceil(height / 24))].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridH, { top: i * 24 }]} />
        ))}
        {[...Array(Math.ceil(width / 24))].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridV, { left: i * 24 }]} />
        ))}
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.holographicOverlay, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] }) }]}
      />
      <View style={styles.circuits}>
        {[...Array(12)].map((_, i) => (
          <View key={`c-${i}`} style={[styles.circuitLine, { top: 30 + i * 70, opacity: 0.15 + (i % 3) * 0.08 }]} />
        ))}
      </View>
      <Animated.View pointerEvents="none" style={[styles.scanBeam, { transform: [{ translateY: scanY }], opacity: laserOpacity }]} />
      <View pointerEvents="none" style={styles.particleLayer}>{renderParticles()}</View>

      <View style={[styles.cornerBracket, styles.topLeft]} />
      <View style={[styles.cornerBracket, styles.topRight]} />
      <View style={[styles.cornerBracket, styles.bottomLeft]} />
      <View style={[styles.cornerBracket, styles.bottomRight]} />

      <Animated.View style={[styles.formWrap, { borderColor: pulseBorderColor, transform: [{ translateX: glitchOffset }] }]}>
        <Animated.View style={[styles.laserTop, { opacity: laserOpacity }]} />
        <Animated.View style={[styles.laserBottom, { opacity: laserOpacity }]} />
        <Animated.View style={{ transform: [{ translateX: glitchOffset }] }}>
          <Text style={styles.brand}>THANHTRUC</Text>
        </Animated.View>
        <Text style={styles.tag}>█ SECURITY FOR ME █</Text>
        <Text style={styles.status}> QUÊN MẬT KHẨU</Text>

        <TouchableOpacity onPress={() => setFocusedInput("email")} activeOpacity={1}
          style={[styles.inputRow, focusedInput === "email" && styles.inputRowFocused]}>
          <Icon name="envelope" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Nhập email của bạn"
            placeholderTextColor="#4A9FB5"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </TouchableOpacity>

        <Text style={styles.infoText}>Email xác nhận sẽ được gửi trong vòng 5 phút</Text>

        <Animated.View style={[styles.btnContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={handleSendResetEmail}
            disabled={loading} activeOpacity={0.8}>
            <Text style={styles.btnText}>{loading ? "█ ĐANG GỬI... █" : "█ GỬI EMAIL █"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.readout}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.readoutText, { color: "#00F0FF", marginTop: 8 }]}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}
