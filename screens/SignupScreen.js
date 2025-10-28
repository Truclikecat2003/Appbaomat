"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { LinearGradient } from "expo-linear-gradient"
import { database } from "../firebaseConfig"
import { ref, get, set, push } from "firebase/database"
import CryptoJS from "crypto-js"

const { width, height } = Dimensions.get("window")

export default function SignupScreen({ navigation }) {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  const master = useRef(new Animated.Value(0)).current
  const scan = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const laser = useRef(new Animated.Value(0)).current
  const glitch = useRef(new Animated.Value(0)).current
  const hologram = useRef(new Animated.Value(0)).current
  const buttonPress = useRef(new Animated.Value(0)).current

  const PARTICLE_COUNT = 220
  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = Math.random() * 35 + 5
      const size = Math.random() * 4 + 0.8
      const speed = Math.random() * 0.8 + 0.1
      const txMax = (Math.cos(speed * 7 + (i % 7)) * radius) / 1.2
      const tyMax = (Math.sin(speed * 5 + (i % 5)) * radius) / 1.2
      arr.push({
        id: i,
        cx: Math.random() * width,
        cy: Math.random() * height,
        size,
        alpha: Math.random() * 0.9 + 0.2,
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
          duration: 16000,
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

    loops.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(hologram, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(hologram, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]),
      ),
    )

    loops.forEach((a) => a.start())

    return () => {
      loops.forEach((a) => a.stop && a.stop())
    }
  }, [])

  const handleSignup = async () => {
    function cleanText(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
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
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      Alert.alert("Lỗi", "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt")
      return
    }

    setLoading(true)
    try {
      const emailKey = email.replace(/\./g, ",")
      const usernameKey = username.toLowerCase()

      const emailRef = ref(database, `emails/${emailKey}`)
      const usernameRef = ref(database, `usernames/${usernameKey}`)

      const [emailSnap, usernameSnap] = await Promise.all([get(emailRef), get(usernameRef)])

      if (emailSnap.exists()) {
        setLoading(false)
        Alert.alert("Lỗi", "Email đã được đăng ký")
        return
      }

      if (usernameSnap.exists()) {
        setLoading(false)
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

      setLoading(false)

      Animated.sequence([
        Animated.timing(buttonPress, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(buttonPress, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start()

      Alert.alert("Đăng ký thành công!", `Chào mừng ${fullname}!`)
      navigation.navigate("LoginScreen")
    } catch (error) {
      setLoading(false)
      console.error(error)
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký")
    }
  }

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

  const hologramOpacity = hologram.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  })

  const buttonScale = buttonPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
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
        style={[
          styles.holographicOverlay,
          {
            opacity: hologramOpacity,
          },
        ]}
      />

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

      <View pointerEvents="none" style={styles.particleLayer}>
        {renderParticles()}
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.alertNode,
          {
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.4],
                }),
              },
            ],
            opacity: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ]}
      />

      <View style={[styles.cornerBracket, styles.topLeft]} />
      <View style={[styles.cornerBracket, styles.topRight]} />
      <View style={[styles.cornerBracket, styles.bottomLeft]} />
      <View style={[styles.cornerBracket, styles.bottomRight]} />

      <Animated.ScrollView
        style={{ width: "80%" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
      >
        <Animated.View
          style={[
            styles.formWrap,
            {
              borderColor: pulseBorderColor,
              transform: [{ translateX: glitchOffset }],
            },
          ]}
        >
          <Animated.View style={[styles.laserTop, { opacity: laserOpacity }]} />
          <Animated.View style={[styles.laserBottom, { opacity: laserOpacity }]} />

          <Animated.View style={{ transform: [{ translateX: glitchOffset }] }}>
            <Text style={styles.brand}>THANHTRUC</Text>
          </Animated.View>
          <Text style={styles.tag}>█  SECURITY FOR ME  █</Text>
          <Text style={styles.status}>ĐĂNG KÝ TÀI KHOẢN</Text>

          {/* Fullname input */}
          <TouchableOpacity
            onPress={() => setFocusedInput("fullname")}
            activeOpacity={1}
            style={[styles.inputRow, focusedInput === "fullname" && styles.inputRowFocused]}
          >
            <Icon name="id-card" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Họ và tên"
              placeholderTextColor="#4A9FB5"
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
              onFocus={() => setFocusedInput("fullname")}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
            />
          </TouchableOpacity>

          {/* Username input */}
          <TouchableOpacity
            onPress={() => setFocusedInput("username")}
            activeOpacity={1}
            style={[styles.inputRow, focusedInput === "username" && styles.inputRowFocused]}
          >
            <Icon name="user" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Tên đăng nhập"
              placeholderTextColor="#4A9FB5"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
              autoCapitalize="none"
            />
          </TouchableOpacity>

          {/* Email input */}
          <TouchableOpacity
            onPress={() => setFocusedInput("email")}
            activeOpacity={1}
            style={[styles.inputRow, focusedInput === "email" && styles.inputRowFocused]}
          >
            <Icon name="envelope" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#4A9FB5"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
              keyboardType="email-address"
            />
          </TouchableOpacity>

          {/* Password input */}
          <TouchableOpacity
            onPress={() => setFocusedInput("password")}
            activeOpacity={1}
            style={[styles.inputRow, focusedInput === "password" && styles.inputRowFocused]}
          >
            <Icon name="lock" color="#00F0FF" size={18} style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#4A9FB5"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
              style={{ paddingHorizontal: 8 }}
            >
              <Icon name={showPassword ? "eye-slash" : "eye"} color="#00F0FF" size={16} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Confirm Password input */}
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
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>{loading ? "█ ĐANG ĐĂNG KÝ █" : "█ TẠO TÀI KHOẢN█"}</Text>
            </TouchableOpacity>
          </Animated.View>

           

          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={{ marginTop: 16 }}>
            <Text style={styles.loginText}>
              Đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
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

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
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
    height: 140,
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

  alertNode: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 18,
    backgroundColor: "#FF00FF",
    right: 40,
    top: 140,
    shadowColor: "#FF00FF",
    shadowRadius: 20,
    shadowOpacity: 0.98,
    zIndex: 6,
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
  width: "98%",
  maxWidth: 1000,
  backgroundColor: "rgba(5,10,20,0.55)",
  paddingVertical: 32,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 2,
  alignItems: "center",
  shadowColor: "#00F0FF",
  shadowRadius: 28,
  shadowOpacity: 0.15,
  overflow: "hidden",
  alignSelf: "center",
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
    fontSize: 15,
    marginBottom: 4,
    letterSpacing: 2,
    fontWeight: "800",
  },
  status: {
    color: "#00FF88",
    fontSize: 16,
    marginBottom: 20,
    letterSpacing: 1,
    fontWeight: "bold",
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
    marginTop: 16,
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

  readout: {
    marginTop: 18,
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,240,255,0.15)",
  },
  readoutText: {
    color: "#4A9FB5",
    fontSize: 10,
    letterSpacing: 1,
    marginVertical: 2,
    fontWeight: "600",
  },

  loginText: {
    fontSize: 14,
    color: "#4A9FB5",
    textAlign: "center",
    fontWeight: "500",
  },
  loginLink: {
    color: "#00F0FF",
    fontWeight: "700",
  },
})
