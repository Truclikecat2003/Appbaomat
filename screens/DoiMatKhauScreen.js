"use client"
import { useState, useRef, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Dimensions,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { LinearGradient } from "expo-linear-gradient"
import { database } from "../firebaseConfig"
import { update, ref, get } from "firebase/database"
import CryptoJS from "crypto-js"

const { width, height } = Dimensions.get("window")

/**
 * CYBER SENTINEL PRO — Change Password Screen (OTP Verification)
 * - Tương đồng với LoginScreen theme
 * - Xác nhận OTP 6 chữ số
 * - Đổi mật khẩu mới
 */

export default function DoiMatKhauScreen({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.email || "")
  const [otp, setOtp] = useState("")
  const [correctOtp, setCorrectOtp] = useState(route?.params?.otp || "123456") // Mock OTP
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // --- animation drivers (tối ưu hiệu suất) ---
  const master = useRef(new Animated.Value(0)).current
  const scan = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const laser = useRef(new Animated.Value(0)).current
  const glitch = useRef(new Animated.Value(0)).current
  const buttonPress = useRef(new Animated.Value(0)).current
  const formSlide = useRef(new Animated.Value(0)).current

  // --- particles (optimized) ---
  const PARTICLE_COUNT = 140
  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = Math.random() * 28 + 5
      const size = Math.random() * 2.8 + 0.6
      const speed = Math.random() * 0.5 + 0.1
      const txMax = (Math.cos(speed * 7 + (i % 7)) * radius) / 1.2
      const tyMax = (Math.sin(speed * 5 + (i % 5)) * radius) / 1.2
      arr.push({
        id: i,
        cx: Math.random() * width,
        cy: Math.random() * height,
        size,
        alpha: Math.random() * 0.7 + 0.15,
        speed,
        txMax,
        tyMax,
        hue: i % 3 === 0 ? "#00F0FF" : i % 3 === 1 ? "#FF00FF" : "#00FF88",
      })
    }
    return arr
  }, [])

  // --- animation loops (xử lý đa luồng) ---
  useEffect(() => {
    const loops = []

    loops.push(
      Animated.loop(
        Animated.timing(master, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ),
    )

    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(scan, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: false }),
          Animated.timing(scan, { toValue: 0, duration: 5000, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ),
    )

    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 2200,
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
            duration: 3500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(laser, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
      ),
    )

    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(glitch, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: false }),
          Animated.timing(glitch, { toValue: 0, duration: 8000, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ),
    )

    loops.forEach((a) => a.start())

    return () => {
      loops.forEach((a) => a.stop?.())
    }
  }, [])

  // --- Xác nhận OTP ---
  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập OTP 6 chữ số.")
      return
    }

    if (otp !== correctOtp) {
      Alert.alert("Lỗi", "OTP không chính xác. Vui lòng kiểm tra lại.")
      setOtp("")
      return
    }

    // OTP đúng - hiển thị form đổi mật khẩu
    Animated.sequence([
      Animated.timing(buttonPress, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(buttonPress, { toValue: 0, duration: 400, useNativeDriver: false }),
    ]).start()

    Animated.timing(formSlide, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()

    setOtpVerified(true)
    Alert.alert("Thành công", "OTP xác nhận chính xác. Vui lòng nhập mật khẩu mới.")
  }

  // --- Đổi mật khẩu ---
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu mới.")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải ít nhất 6 ký tự.")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.")
      return
    }

    setLoading(true)

    try {
      // Tìm user từ email
      const usersRef = ref(database, "users")
      const snap = await get(usersRef)
      const users = snap.val() || {}
      let foundUser = null

      for (const key in users) {
        if (users[key].email?.toLowerCase() === email.toLowerCase()) {
          foundUser = { id: key, ...users[key] }
          break
        }
      }

      if (!foundUser) {
        setLoading(false)
        Alert.alert("Lỗi", "Không tìm thấy tài khoản.")
        return
      }

      // Cập nhật mật khẩu mới (mã hóa MD5)
      const hashedPassword = CryptoJS.MD5(newPassword).toString()
      await update(ref(database, `users/${foundUser.id}`), {
        password: hashedPassword,
        lastPasswordChange: new Date().toISOString(),
      })

      setLoading(false)

      Animated.sequence([
        Animated.timing(buttonPress, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(buttonPress, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start()

      Alert.alert("Thành công", "Mật khẩu đã được thay đổi. Quay lại để đăng nhập.")
      setTimeout(() => {
        navigation.popToTop()
      }, 1000)
    } catch (err) {
      setLoading(false)
      Alert.alert("Lỗi", err.message || "Không thể cập nhật mật khẩu.")
    }
  }

  // --- interpolations ---
  const scanY = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.7, height * 0.7],
  })

  const pulseBorderColor = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["rgba(0,240,255,0.15)", "rgba(0,240,255,0.95)", "rgba(0,240,255,0.15)"],
  })

  const laserOpacity = laser.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.35],
  })

  const glitchOffset = glitch.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 3, -2, 2, 0],
  })

  const buttonScale = buttonPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  })

  const passwordFormOpacity = formSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const passwordFormScale = formSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  })

  const renderParticles = () => {
    return particles.map((p) => {
      const tx = master.interpolate({
        inputRange: [0, 1],
        outputRange: [0, p.txMax],
      })
      const ty = master.interpolate({
        inputRange: [0, 1],
        outputRange: [0, p.tyMax],
      })

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
      {/* Grid background */}
      <View style={styles.gridLayer}>
        {[...Array(Math.ceil(height / 24))].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridH, { top: i * 24 }]} />
        ))}
        {[...Array(Math.ceil(width / 24))].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridV, { left: i * 24 }]} />
        ))}
      </View>

      {/* Holographic overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.holographicOverlay,
          {
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
          },
        ]}
      />

      {/* Circuit lines */}
      <View style={styles.circuits}>
        {[...Array(12)].map((_, i) => (
          <View
            key={`c-${i}`}
            style={[
              styles.circuitLine,
              { top: 30 + i * 70, opacity: 0.15 + (i % 3) * 0.08, transform: [{ rotate: `${(i % 4) * 5}deg` }] },
            ]}
          />
        ))}
      </View>

      {/* Scan beam */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.scanBeam,
          {
            transform: [{ translateY: scanY }],
            opacity: laserOpacity,
          },
        ]}
      />

      {/* Particles */}
      <View pointerEvents="none" style={styles.particleLayer}>
        {renderParticles()}
      </View>

      {/* Corner brackets */}
      <View style={[styles.cornerBracket, styles.topLeft]} />
      <View style={[styles.cornerBracket, styles.topRight]} />
      <View style={[styles.cornerBracket, styles.bottomLeft]} />
      <View style={[styles.cornerBracket, styles.bottomRight]} />

      {/* Main form panel */}
      <Animated.View
        style={[
          styles.formWrap,
          {
            borderColor: pulseBorderColor,
            transform: [{ translateX: glitchOffset }],
          },
        ]}
      >
        {/* Laser bars */}
        <Animated.View style={[styles.laserTop, { opacity: laserOpacity }]} />
        <Animated.View style={[styles.laserBottom, { opacity: laserOpacity }]} />

        {/* Brand */}
        <Animated.View style={{ transform: [{ translateX: glitchOffset }] }}>
          <Text style={styles.brand}>THANHTRUC</Text>
        </Animated.View>
        <Text style={styles.tag}>█ XÁC NHẬN OTP █</Text>
        <Text style={styles.status}>ĐỔI MẬT KHẨU</Text>

        {/* Email display */}
        <View style={styles.emailBox}>
          <Text style={styles.emailLabel}>Email:</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* OTP Section */}
        {!otpVerified && (
          <View>
            {/* OTP input */}
            <TouchableOpacity
              onPress={() => setFocusedInput("otp")}
              activeOpacity={1}
              style={[styles.inputRow, focusedInput === "otp" && styles.inputRowFocused]}
            >
              <Icon name="shield" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Nhập OTP 6 chữ số"
                placeholderTextColor="#4A9FB5"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                onFocus={() => setFocusedInput("otp")}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
                keyboardType="number-pad"
                maxLength={6}
              />
            </TouchableOpacity>

            {/* Verify OTP button */}
            <Animated.View
              style={[
                styles.btnContainer,
                {
                  transform: [{ scale: buttonScale }],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.7 }]}
                onPress={handleVerifyOtp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>{loading ? "█ ĐANG XÁC NHẬN... █" : "█ XÁC NHẬN OTP █"}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Password Section (after OTP verified) */}
        {otpVerified && (
          <Animated.View
            style={[
              styles.passwordForm,
              {
                opacity: passwordFormOpacity,
                transform: [{ scale: passwordFormScale }],
              },
            ]}
          >
            <Text style={[styles.tag, { marginBottom: 12 }]}>█ MẬT KHẨU MỚI █</Text>

            {/* New password */}
            <TouchableOpacity
              onPress={() => setFocusedInput("newPassword")}
              activeOpacity={1}
              style={[styles.inputRow, focusedInput === "newPassword" && styles.inputRowFocused]}
            >
              <Icon name="lock" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Mật khẩu mới"
                placeholderTextColor="#4A9FB5"
                style={styles.input}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setFocusedInput("newPassword")}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
                style={{ paddingHorizontal: 8 }}
              >
                <Icon name={showNewPassword ? "eye-slash" : "eye"} color="#00F0FF" size={16} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Confirm password */}
            <TouchableOpacity
              onPress={() => setFocusedInput("confirmPassword")}
              activeOpacity={1}
              style={[styles.inputRow, focusedInput === "confirmPassword" && styles.inputRowFocused]}
            >
              <Icon name="lock" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
              <TextInput
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#4A9FB5"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput("confirmPassword")}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                style={{ paddingHorizontal: 8 }}
              >
                <Icon name={showConfirmPassword ? "eye-slash" : "eye"} color="#00F0FF" size={16} />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Change password button */}
            <Animated.View
              style={[
                styles.btnContainer,
                {
                  transform: [{ scale: buttonScale }],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.7 }, { backgroundColor: "rgba(0,255,136,0.88)" }]}
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnText, { color: "#000814" }]}>
                  {loading ? "█ ĐANG CẬP NHẬT... █" : "█ ĐỔI MẬT KHẨU █"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/* Back button */}
        <View style={styles.readout}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.readoutText, { color: "#00F0FF" }]}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000814",
    alignItems: "center",
    justifyContent: "center",
  },
  gridLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  gridH: {
    position: "absolute",
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,240,255,0.04)",
  },
  gridV: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(0,240,255,0.035)",
  },
  holographicOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,0,255,0.02)",
  },
  circuits: {
    position: "absolute",
    width: "120%",
    height: "120%",
    left: "-10%",
    top: "-8%",
    pointerEvents: "none",
  },
  circuitLine: {
    position: "absolute",
    height: 2,
    width: "120%",
    backgroundColor: "rgba(0,240,255,0.14)",
    shadowColor: "#00F0FF",
    shadowRadius: 10,
  },
  scanBeam: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,240,255,0.08)",
    shadowColor: "#00F0FF",
    shadowRadius: 32,
    shadowOpacity: 0.7,
  },
  particleLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    borderRadius: 50,
    shadowRadius: 8,
    shadowOpacity: Platform.OS === "ios" ? 0.95 : 0.7,
  },
  cornerBracket: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#00F0FF",
    borderWidth: 2,
  },
  topLeft: {
    top: 60,
    left: 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 60,
    right: 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 60,
    left: 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 60,
    right: 20,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  formWrap: {
    width: "88%",
    maxWidth: 800,
    backgroundColor: "rgba(5,10,20,0.55)",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#00F0FF",
    shadowRadius: 28,
    shadowOpacity: 0.15,
    overflow: "hidden",
  },
  laserTop: {
    position: "absolute",
    top: -10,
    left: 12,
    right: 12,
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(0,255,255,0.7)",
    shadowColor: "#00F0FF",
    shadowRadius: 24,
    shadowOpacity: 0.95,
  },
  laserBottom: {
    position: "absolute",
    bottom: -10,
    left: 12,
    right: 12,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,255,255,0.5)",
    shadowColor: "#00F0FF",
    shadowRadius: 20,
    shadowOpacity: 0.8,
  },
  brand: {
    color: "#E0FFFF",
    fontSize: 32,
    letterSpacing: 3,
    fontWeight: "900",
    marginBottom: 8,
    textShadowColor: "#00F0FF",
    textShadowRadius: 14,
  },
  tag: {
    color: "#00F0FF",
    fontSize: 11,
    marginBottom: 4,
    letterSpacing: 2,
    fontWeight: "700",
  },
  status: {
    color: "#00FF88",
    fontSize: 22,
    marginBottom: 16,
    letterSpacing: 1,
    fontWeight: "600",
  },
  emailBox: {
    width: "100%",
    backgroundColor: "rgba(0,255,136,0.06)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,255,136,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  emailLabel: {
    color: "#00FF88",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emailText: {
    color: "#E0FFFF",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  inputRow: {
    width: "100%",
    backgroundColor: "rgba(0,240,255,0.04)",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(0,240,255,0.18)",
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 14,
    alignItems: "center",
    flexDirection: "row",
  },
  inputRowFocused: {
    backgroundColor: "rgba(0,240,255,0.08)",
    borderColor: "rgba(0,240,255,0.6)",
    shadowColor: "#00F0FF",
    shadowRadius: 12,
    shadowOpacity: 0.3,
  },
  input: {
    flex: 1,
    color: "#E0FFFF",
    fontSize: 15,
    paddingVertical: 8,
    fontWeight: "500",
  },
  btnContainer: {
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
  },
  btn: {
    width: "100%",
    backgroundColor: "rgba(0,240,255,0.92)",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,255,255,0.3)",
    shadowColor: "#00F0FF",
    shadowRadius: 16,
    shadowOpacity: 0.4,
  },
  btnText: {
    color: "#000814",
    fontWeight: "900",
    letterSpacing: 1.5,
    fontSize: 14,
  },
  passwordForm: {
    width: "100%",
  },
  readout: {
    marginTop: 12,
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,240,255,0.15)",
  },
  readoutText: {
    color: "#4A9FB5",
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
})
