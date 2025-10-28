"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRoute, useNavigation } from "@react-navigation/native"
import { getDatabase, ref, get } from "firebase/database"
import { app } from "../firebaseConfig"

const { width, height } = Dimensions.get("window") // Lấy chiều rộng & cao màn hình

/* ---------------------- Colors ---------------------- */
const darkColors = {
  bg: "#0a0f0c",                 
  headerBg: "#0f1f18",           
  headerBorder: "#22c55e",       
  headerText: "#22c55e",         
  subtitle: "#86efac",           
  cardBg: "#152a21",             
  cardGradientLight: "#1f352e",  
  cardShadow: "#22c55e",          
  icon: "#22c55e",               
  itemCount: "#86efac",          
  hintBtnBg: "rgba(34,197,94,0.15)", 
  hintBtnBorder: "#22c55e",      
  hintText: "#d1fae5",           
  openBtnBg: "#22c55e",           
  fabBg: "#22c55e",               
  fabText: "#0a0f0c",             
  modalBg: "#152a21",             
  modalBorder: "#22c55e",         
  modalShadow: "#22c55e",         
}

const lightColors = {
  bg: "#f0fdf4",                 
  headerBg: "#e6f4ea",           
  headerBorder: "#10b981",       
  headerText: "#047857",         
  subtitle: "#065f46",           
  cardBg: "#ffffff",             
  cardGradientLight: "#d1fae5",  
  cardShadow: "#10b981",         
  icon: "#10b981",               
  itemCount: "#059669",          
  hintBtnBg: "rgba(5,150,105,0.12)", 
  hintBtnBorder: "#059669",      
  hintText: "#065f46",           
  openBtnBg: "#10b981",          
  fabBg: "#059669",              
  fabText: "#ffffff",            
  modalBg: "#f5fdf9",            
  modalBorder: "#10b981",        
  modalShadow: "#10b981",        
}

/* ---------------------- Header Section ---------------------- */
const HeaderSection = ({ darkMode, username, role, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-120)).current
  const colors = darkMode ? darkColors : lightColors

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          backgroundColor: colors.headerBg,
          borderBottomColor: colors.headerBorder,
          transform: [{ translateY: slideAnim }],
          shadowColor: colors.headerBorder,
          shadowOpacity: 0.3,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>HACKERLAB</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
            Cybersecurity Training Platform
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.headerUser, { color: colors.headerText }]}>
            ⟦ {username || "Khách"} ⟧
          </Text>
          {role === "admin" && (
            <TouchableOpacity
              style={[styles.adminBtn, { borderColor: colors.headerBorder, backgroundColor: colors.hintBtnBg }]}
              onPress={() => navigation.navigate("QuanLyTaiLieu", { userData: { username, role } })}
            >
              <Text style={[styles.adminText, { color: colors.headerText }]}>QUẢN LÝ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

/* ---------------------- Animated Background ---------------------- */
const AnimatedBackground = ({ darkMode }) => {
  const scanlineAnim = useRef(new Animated.Value(0)).current
  const matrixRainAnim = useRef(new Animated.Value(0)).current
  const particleAnim = useRef(new Animated.Value(0)).current

  const colors = darkMode ? darkColors : lightColors

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanlineAnim, { toValue: 1, duration: 4000, useNativeDriver: false })
    ).start()
    Animated.loop(
      Animated.timing(matrixRainAnim, { toValue: 1, duration: 8000, useNativeDriver: false })
    ).start()
    Animated.loop(
      Animated.timing(particleAnim, { toValue: 1, duration: 10000, useNativeDriver: false })
    ).start()
  }, [])

  const scanlineOpacity = scanlineAnim.interpolate({ inputRange: [0, 1], outputRange: [0.02, 0.08] })
  const matrixOpacity = matrixRainAnim.interpolate({ inputRange: [0, 1], outputRange: [0.04, 0.12] })
  const particleTranslate = particleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, height] })

  // Tạo nhiều particle nhỏ rơi
  const particles = Array.from({ length: 40 }, (_, i) => (
    <Animated.View
      key={i}
      style={{
        position: "absolute",
        top: Math.random() * height,
        left: Math.random() * width,
        width: Math.random() * 3 + 1,
        height: Math.random() * 6 + 2,
        backgroundColor: colors.icon,
        opacity: 0.2 + Math.random() * 0.5,
        transform: [{ translateY: particleTranslate }],
        borderRadius: 2,
      }}
    />
  ))

  return (
    <View style={styles.bgContainer}>
      <LinearGradient
        colors={
          darkMode
            ? ["#000000", "#0a0f0d", "#050a08", "#000000"]
            : ["#ffffff", "#f0fdf4", "#ecfdf5", "#ffffff"]
        }
        style={styles.bgGradient}
      />
      {/* Matrix Rain Effect */}
      <Animated.View
        style={[styles.matrixGrid, { opacity: matrixOpacity, backgroundColor: colors.icon }]}
      />
      {/* Scanlines Overlay */}
      <Animated.View style={[styles.scanlines, { opacity: scanlineOpacity }]} />
      {/* Particles */}
      {particles}
    </View>
  )
}

/* ---------------------- Main UI ---------------------- */
export default function TailieuScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const username = route.params?.userData?.username ?? ""
  const role = route.params?.userData?.role ?? ""

  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [hintVisible, setHintVisible] = useState(false)
  const [currentHint, setCurrentHint] = useState("Đang tải...")
  const [fontSize, setFontSize] = useState(13)
  const [darkMode, setDarkMode] = useState(true)
  const cardScaleAnims = useRef({}).current

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id)
  const colors = darkMode ? darkColors : lightColors

  /* ---------------------- Fetch dữ liệu từ Firebase ---------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app)
        const snap = await get(ref(db, "tailieu"))
        if (!snap.exists()) return setData([]), setLoading(false)

        const base = {
          WEB: { id: "1", type: "Web", icon: "🌐", color: colors.icon, lightColor: colors.cardGradientLight, titles: [], urls: [], hints: [] },
          VIDEO: { id: "2", type: "Video", icon: "🎥", color: colors.icon, lightColor: colors.cardGradientLight, titles: [], urls: [], hints: [] },
          PDF: { id: "3", type: "PDF", icon: "📄", color: colors.icon, lightColor: colors.cardGradientLight, titles: [], urls: [], hints: [] },
          APP: { id: "4", type: "App", icon: "📱", color: colors.icon, lightColor: colors.cardGradientLight, titles: [], urls: [], hints: [] },
          "DIỄN ĐÀN": { id: "5", type: "Diễn đàn", icon: "💬", color: colors.icon, lightColor: colors.cardGradientLight, titles: [], urls: [], hints: [] },
        }

        const ds = Object.values(snap.val())
        for (const tl of ds) {
          const loai = (tl.loai || "").toUpperCase()
          if (base[loai]) {
            base[loai].titles.push(tl.tentailieu || "Untitled")
            base[loai].urls.push(tl.link || "")
            base[loai].hints.push(tl.GoiY || "Chưa có gợi ý")
          }
        }

        setData(Object.values(base).filter((g) => g.titles.length))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [darkMode])

  /* ---------------------- Card Animation ---------------------- */
  const getCardScale = (id) => {
    if (!cardScaleAnims[id]) cardScaleAnims[id] = new Animated.Value(1)
    return cardScaleAnims[id]
  }
  const handleCardPressIn = (id) => {
    Animated.spring(getCardScale(id), { toValue: 0.98, useNativeDriver: true }).start()
  }
  const handleCardPressOut = (id) => {
    Animated.spring(getCardScale(id), { toValue: 1, useNativeDriver: true }).start()
  }

  /* ---------------------- Render UI ---------------------- */
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AnimatedBackground darkMode={darkMode} />
      <HeaderSection darkMode={darkMode} username={username} role={role} navigation={navigation} />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.icon} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => toggleExpand(item.id)}
              onPressIn={() => handleCardPressIn(item.id)}
              onPressOut={() => handleCardPressOut(item.id)}
              style={styles.cardWrap}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    borderLeftColor: item.color,
                    backgroundColor: colors.cardBg,
                    transform: [{ scale: getCardScale(item.id) }],
                    shadowColor: item.color,
                    shadowOpacity: darkMode ? 0.35 : 0.15,
                    shadowRadius: 12,
                  },
                ]}
              >
                <LinearGradient colors={[item.lightColor, colors.cardBg]} style={styles.cardHeader}>
                  <Text style={[styles.iconText, { color: item.color, fontSize: fontSize + 8 }]}>{item.icon}</Text>
                  <View style={styles.headerText}>
                    <Text
                      style={[
                        styles.catTitle,
                        {
                          color: item.color,
                          fontSize: fontSize + 2,
                          fontWeight: "700",
                          textShadowColor: darkMode ? "rgba(0,0,0,0.5)" : "transparent",
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 3,
                        },
                      ]}
                    >
                      {item.type}
                    </Text>
                    <Text style={[styles.itemCount, { color: colors.itemCount, fontSize: fontSize - 1 }]}>
                      {item.titles.length} tài liệu
                    </Text>
                  </View>
                  <Text style={[styles.expandArrow, { color: item.color, fontSize: 18 }]}>{expandedId === item.id ? "▼" : "▶"}</Text>
                </LinearGradient>

                {expandedId === item.id && (
                  <View style={styles.expanded}>
                    {item.titles.map((title, i) => (
                      <View key={i} style={[styles.challengeRow, { borderLeftColor: item.color }]}>
                        <View style={styles.challengeTitleWrap}>
                          <Text
                            style={[styles.challengeTitle, { fontSize, color: colors.hintText, fontWeight: "500" }]}
                            allowFontScaling
                          >
                            {title}
                          </Text>
                        </View>
                        <View style={styles.challengeActions}>
                          <TouchableOpacity
                            style={[styles.hintBtn, { borderColor: item.color, backgroundColor: colors.hintBtnBg }]}
                            onPress={() => {
                              setHintVisible(true)
                              setCurrentHint(item.hints[i])
                            }}
                          >
                            <Text style={[styles.hintBtnText, { color: item.color, fontSize: fontSize - 1, fontWeight: "600" }]}>
                              Hint
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.openBtn, { backgroundColor: item.color }]}>
                            <Text style={[styles.openBtnText, { fontSize: fontSize - 1, fontWeight: "700" }]}>Open</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Hint Modal */}
      <Modal visible={hintVisible} transparent animationType="fade">
        <View style={styles.hintOverlay}>
          <View
            style={[
              styles.hintBox,
              {
                backgroundColor: colors.modalBg,
                borderColor: colors.modalBorder,
                shadowColor: colors.modalShadow,
                shadowOpacity: 0.25,
                shadowRadius: 20,
              },
            ]}
          >
            <Text style={[styles.hintTitle, { color: colors.headerBorder, fontWeight: "700" }]}>GỢI Ý</Text>
            <ScrollView>
              <Text style={[styles.hintText, { color: colors.hintText, fontSize, lineHeight: fontSize * 1.6 }]}>{currentHint}</Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setHintVisible(false)}
              style={[styles.hintClose, { borderColor: colors.headerBorder, backgroundColor: colors.hintBtnBg }]}
            >
              <Text style={[styles.hintCloseText, { color: colors.headerBorder, fontWeight: "600" }]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Control Buttons: Thay đổi fontSize và toggle darkMode */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => setFontSize((f) => Math.max(10, f - 1))}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}
        >
          <Text style={[styles.fabText, { color: colors.fabText, fontWeight: "700" }]}>A−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFontSize((f) => Math.min(22, f + 1))}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}
        >
          <Text style={[styles.fabText, { color: colors.fabText, fontWeight: "700" }]}>A+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDarkMode((d) => !d)} style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}>
          <Text style={[styles.fabText, { fontSize: 16 }]}>{darkMode ? "☀" : "🌙"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  headerSection: { paddingTop: 20, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1.5, zIndex: 20 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "800", letterSpacing: 2, marginBottom: 4 },
  headerSubtitle: { fontSize: 12, fontWeight: "500", letterSpacing: 0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerUser: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5 },
  container: { flex: 1 },
  bgContainer: { ...StyleSheet.absoluteFillObject },
  bgGradient: { ...StyleSheet.absoluteFillObject },
  matrixGrid: { ...StyleSheet.absoluteFillObject },
  scanlines: { ...StyleSheet.absoluteFillObject, backgroundColor: "#ffffff11" },
  adminBtn: { borderWidth: 1.5, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, shadowOpacity: 0.3, shadowRadius: 8 },
  adminText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  list: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 140 },
  cardWrap: { marginBottom: 16 },
  card: { borderRadius: 16, borderLeftWidth: 6, overflow: "hidden", elevation: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  iconText: { marginRight: 4 },
  headerText: { flex: 1 },
  catTitle: { flexWrap: "wrap" },
  itemCount: { fontSize: 12, marginTop: 2 },
  expandArrow: { fontSize: 16 },
  expanded: { paddingHorizontal: 14, paddingVertical: 12 },
  challengeRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 8, gap: 8 },
  challengeTitleWrap: { flex: 1 },
  challengeTitle: { flexShrink: 1, flexWrap: "wrap", lineHeight: 20 },
  challengeActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  hintBtn: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  hintBtnText: { fontSize: 12 },
  openBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  openBtnText: { color: "#fff" },
  hintOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  hintBox: { width: "100%", borderRadius: 14, borderWidth: 1.5, padding: 16, maxHeight: "70%" },
  hintTitle: { fontSize: 16, marginBottom: 8 },
  hintText: { fontSize: 13 },
  hintClose: { marginTop: 14, borderWidth: 1.5, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  hintCloseText: { fontSize: 13 },
  fabContainer: { position: "absolute", bottom: 24, right: 16, flexDirection: "row", gap: 12 },
  fabBtn: { borderRadius: 50, padding: 12, justifyContent: "center", alignItems: "center" },
  fabText: { fontSize: 14 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
})
