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
import { get, ref, update } from "firebase/database"
import { database } from "../firebaseConfig"
import CryptoJS from "crypto-js"

const { width, height } = Dimensions.get("window")

/**
 * CYBER SENTINEL PRO — Ultra-Premium Cybersecurity Login Interface
 * - Glitch effects, holographic elements, advanced animations
 * - Professional hacker aesthetic with neon cyan/magenta accents
 * - High-tech digital readout style with corner brackets
 * - Smooth 60fps animations with particle systems
 */

export default function LoginScreen({ navigation }) {
  // --- state ---
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // --- animation drivers ---
  const master = useRef(new Animated.Value(0)).current
  const scan = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const laser = useRef(new Animated.Value(0)).current
  const glitch = useRef(new Animated.Value(0)).current
  const hologram = useRef(new Animated.Value(0)).current
  const buttonPress = useRef(new Animated.Value(0)).current

  // --- particles (enhanced) ---
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

  // --- animation loops ---
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

  // --- login logic ---
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.")
      return
    }
    setLoading(true)
    try {
      const usersRef = ref(database, "users")
      const snap = await get(usersRef)
      const users = snap.val() || {}
      let foundUser = null
      for (const key in users) {
        if (users[key].username && users[key].username.toLowerCase() === username.toLowerCase()) {
          foundUser = { id: key, ...users[key] }
          break
        }
      }

      if (!foundUser) {
        setLoading(false)
        Alert.alert("Lỗi", "Tên đăng nhập không tồn tại")
        return
      }

      const hash = CryptoJS.MD5(password).toString()
      if (hash !== foundUser.password) {
        setLoading(false)
        Alert.alert("Sai mật khẩu", "Vui lòng thử lại.")
        return
      }

      await update(ref(database, `users/${foundUser.id}`), { lastLogin: new Date().toISOString() })
      setLoading(false)

      // Success animation
      Animated.sequence([
        Animated.timing(buttonPress, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(buttonPress, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start()

      Alert.alert("Đăng nhập thành công!", `Xin chào ${foundUser.username}`)
      navigation.navigate("HomeScreen", { username: foundUser.username })
    } catch (err) {
      setLoading(false)
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.")
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

  const hologramOpacity = hologram.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  })

  const buttonScale = buttonPress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  })

  // --- render particles ---
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
      {/* Enhanced grid background */}
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
            opacity: hologramOpacity,
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

      {/* Scan beam (enhanced) */}
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

      {/* Micro-nodes particles */}
      <View pointerEvents="none" style={styles.particleLayer}>
        {renderParticles()}
      </View>

      {/* Alert node (pulsing) */}
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
        {/* Laser accent bars */}
        <Animated.View style={[styles.laserTop, { opacity: laserOpacity }]} />
        <Animated.View style={[styles.laserBottom, { opacity: laserOpacity }]} />

        {/* Glitch text effect */}
        <Animated.View style={{ transform: [{ translateX: glitchOffset }] }}>
          <Text style={styles.brand}>THANHTRUC</Text>
        </Animated.View>
        <Text style={styles.tag}>█ SECURITY FOR ME █</Text>
        <Text style={styles.status}>ĐĂNG NHẬP </Text>

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

        {/* Login button */}
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
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>{loading ? "█ ĐANG TẢI... █" : "█ ĐĂNG NHẬP █"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.readout}>
          <View style={{ height: 1, backgroundColor: "#555", width: "100%", marginVertical: 10 }} />

          <View style={styles.readoutContainer}>
            <Text style={styles.readoutText}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={[styles.readoutText, { textDecorationLine: "underline", color: "#00F0FF" }]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 1, backgroundColor: "#555", width: "100%", marginVertical: 10 }} />

          <TouchableOpacity onPress={() => navigation.navigate("QuenMatKhauScreen")}>
            <Text style={[styles.readoutText, { color: "#FF00FF", fontWeight: "700", letterSpacing: 1.5 }]}>
              ? Quên mật khẩu ?
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000814",
    alignItems: "center",
    justifyContent: "center",
  },

  // Grid background
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

  // Holographic overlay
  holographicOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,0,255,0.02)",
  },

  // Circuit lines
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

  // Scan beam
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

  // Particles
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

  // Alert node
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

  // Corner brackets
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

  // Form panel
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

  // Laser bars
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

  // Typography
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
    fontSize: 26,
    marginBottom: 20,
    letterSpacing: 1,
    fontWeight: "bold",
  },

  // Input rows
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

  // Button
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

  // Digital readout
  readout: {
    marginTop: 18,
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,240,255,0.15)",
  },
  readoutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
  readoutText: {
    color: "#4A9FB5",
    fontSize: 15,
    letterSpacing: 1,
    marginVertical: 2,
    fontWeight: "600",
  },
})
