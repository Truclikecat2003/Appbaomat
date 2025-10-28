"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
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

const { width, height } = Dimensions.get("window")

/* ---------------------- Enhanced Colors with Cybersecurity Theme ---------------------- */
const darkColors = {
  bg: "#0A1628",
  bgSecondary: "#0D1F35",
  headerBg: "#0F2847",
  headerBorder: "#00E5FF",
  headerText: "#E0F7FF",
  subtitle: "#80D8FF",
  cardBg: "#132F52",
  cardBgHover: "#1A3F66",
  cardGradientLight: "#00B8E6",
  cardGradientDark: "#0A1F35",
  icon: "#00E5FF",
  iconSecondary: "#FF006E",
  itemCount: "#80D8FF",
  hintBtnBg: "rgba(0, 229, 255, 0.12)",
  hintBtnBorder: "#00E5FF",
  hintText: "#E0F7FF",
  openBtnBg: "#00E5FF",
  openBtnBorder: "#00E5FF",
  openBtnText: "#0A1628",
  fabBg: "#00E5FF",
  fabText: "#0A1628",
  modalBg: "#0F2847",
  modalBorder: "#00E5FF",
  modalShadow: "#00000088",
  glitchRed: "#FF006E",
  glitchGreen: "#00FF88",
  accentMagenta: "#FF00FF",
}

const lightColors = {
  bg: "#F5F9FF",
  bgSecondary: "#EBF3FF",
  headerBg: "#E3F2FD",
  headerBorder: "#0066CC",
  headerText: "#001A4D",
  subtitle: "#0052A3",
  cardBg: "#FFFFFF",
  cardBgHover: "#F0F7FF",
  cardGradientLight: "#E3F2FD",
  cardGradientDark: "#FFFFFF",
  icon: "#0066CC",
  iconSecondary: "#FF006E",
  itemCount: "#0052A3",
  hintBtnBg: "rgba(0, 102, 204, 0.08)",
  hintBtnBorder: "#0066CC",
  hintText: "#001A4D",
  openBtnBg: "rgba(0, 102, 204, 0.1)",
  openBtnBorder: "#0066CC",
  openBtnText: "#001A4D",
  fabBg: "#0066CC",
  fabText: "#FFFFFF",
  modalBg: "#FFFFFF",
  modalBorder: "#0066CC",
  modalShadow: "#00000011",
  glitchRed: "#FF006E",
  glitchGreen: "#00AA44",
  accentMagenta: "#CC00FF",
}

/* ---------------------- Glitch Effect Component ---------------------- */
const GlitchText = ({ text, color, fontSize, style }) => {
  const glitchOffset1 = useRef(new Animated.Value(0)).current
  const glitchOffset2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const glitchAnimation = () => {
      Animated.sequence([
        Animated.timing(glitchOffset1, { toValue: Math.random() * 4 - 2, duration: 50, useNativeDriver: true }),
        Animated.timing(glitchOffset1, { toValue: 0, duration: 50, useNativeDriver: true }),
        Animated.delay(Math.random() * 3000 + 2000),
      ]).start(() => glitchAnimation())
    }
    glitchAnimation()
  }, [])

  return (
    <Animated.Text
      style={[
        style,
        {
          color,
          fontSize,
          transform: [{ translateX: glitchOffset1 }],
          fontWeight: "700",
          letterSpacing: 1,
        },
      ]}
    >
      {text}
    </Animated.Text>
  )
}

/* ---------------------- Enhanced Header Section ---------------------- */
const HeaderSection = ({ darkMode, username, role, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-120)).current
  const colors = darkMode ? darkColors : lightColors

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
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
          shadowOpacity: darkMode ? 0.4 : 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 3 },
        },
      ]}
    >
      {/* <View style={styles.headerCornerBracket} /> */}
      {/* <View style={[styles.headerCornerBracket, { right: 0, transform: [{ scaleX: -1 }] }]} /> */}

      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.headerBorder }]}>⟦ TÀI LIỆU AN TOÀN BẢO MẬT ⟧</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>Security For Me</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.headerUser, { color: colors.headerText }]}>USER: {username || "GUEST"}</Text>
          {role === "admin" && (
            <TouchableOpacity
              style={[styles.adminBtn, { borderColor: colors.headerBorder, backgroundColor: colors.hintBtnBg }]}
              onPress={() => navigation.navigate("QuanLyTaiLieu", { userData: { username, role } })}
            >
              <Text style={[styles.adminText, { color: colors.headerBorder }]}>⚙ ADMIN</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

/* ---------------------- Enhanced Animated Background ---------------------- */
const AnimatedBackground = ({ darkMode }) => {
  const matrixColumns = 40
  const charSet = "ｦｧｨｩｪｫｬｭｮｯﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ"
  const [matrixData, setMatrixData] = useState([])

  const colors = darkMode
    ? { bg: "#0A1628", main: "#00E5FF", accent: "#FF006E", overlay: "rgba(0,229,255,0.03)" }
    : { bg: "#F5F9FF", main: "#0066CC", accent: "#FF006E", overlay: "rgba(0,102,204,0.02)" }

  useEffect(() => {
    const cols = Array.from({ length: matrixColumns }, () => {
      const charCount = Math.ceil(height / 16)
      return {
        yOffset: Math.random() * height,
        speed: height / 10,
        chars: Array.from({ length: charCount }, () => charSet[Math.floor(Math.random() * charSet.length)]),
        alertIndex: Math.floor(Math.random() * charCount),
      }
    })
    setMatrixData(cols)
  }, [])

  useEffect(() => {
    let lastTime = performance.now()
    let animationId
    const animate = (time) => {
      const delta = (time - lastTime) / 1000
      lastTime = time
      setMatrixData((prev) =>
        prev.map((col) => ({
          ...col,
          yOffset: (col.yOffset + col.speed * delta) % height,
        })),
      )
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      {matrixData.map((col, ci) => (
        <View key={ci} style={{ position: "absolute", left: (width / matrixColumns) * ci }}>
          {col.chars.map((ch, i) => {
            const top = (i * 16 + col.yOffset) % height
            const isAlert = i === col.alertIndex
            const charColor = isAlert ? colors.accent : colors.main
            return (
              <Text
                key={i}
                style={{
                  position: "absolute",
                  top,
                  fontSize: 11,
                  color: charColor,
                  opacity: isAlert ? 0.8 : 0.15,
                  textShadowColor: charColor,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: isAlert ? 6 : 2,
                  fontWeight: "600",
                  letterSpacing: 1,
                  lineHeight: 16,
                }}
              >
                {ch}
              </Text>
            )
          })}
        </View>
      ))}
      <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay }} />
    </View>
  )
}

/* ---------------------- Main Screen ---------------------- */
export default function TailieuScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const username = route.params?.userData?.username ?? ""
  const role = route.params?.userData?.role ?? ""

  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [hintVisible, setHintVisible] = useState(false)
  const [currentHint, setCurrentHint] = useState("Loading...")
  const [fontSize, setFontSize] = useState(13)
  const [darkMode, setDarkMode] = useState(true)
  const cardScaleAnims = useRef({}).current
  const dataCache = useRef(null)

  const toggleExpand = useCallback((id) => setExpandedId((prev) => (prev === id ? null : id)), [])
  const colors = darkMode ? darkColors : lightColors

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        if (dataCache.current) {
          setData(dataCache.current)
          setLoading(false)
          return
        }

        const db = getDatabase(app)
        const snap = await get(ref(db, "tailieu"))
        if (!snap.exists()) {
          setData([])
          setLoading(false)
          return
        }

        const base = {
          WEB: { id: "1", type: "Web", icon: "🌐", titles: [], urls: [], hints: [] },
          VIDEO: { id: "2", type: "Video", icon: "🎥", titles: [], urls: [], hints: [] },
          PDF: { id: "3", type: "PDF", icon: "📄", titles: [], urls: [], hints: [] },
          APP: { id: "4", type: "App", icon: "📱", titles: [], urls: [], hints: [] },
          "DIỄN ĐÀN": { id: "5", type: "Diễn đàn", icon: "💬", titles: [], urls: [], hints: [] },
        }

        const ds = Object.values(snap.val())
        for (const tl of ds) {
          const loai = (tl.loai || "").toUpperCase()
          if (base[loai]) {
            base[loai].titles.push(tl.tentailieu || "Untitled")
            base[loai].urls.push(tl.link || "")
            base[loai].hints.push(tl.GoiY || "Không có gợi ý.")
          }
        }

        const result = Object.values(base).filter((g) => g.titles.length)
        dataCache.current = result
        setData(result)
      } catch (e) {
        console.error("[v0] Data fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCardScale = useCallback((id) => {
    if (!cardScaleAnims[id]) cardScaleAnims[id] = new Animated.Value(1)
    return cardScaleAnims[id]
  }, [])

  const handleCardPressIn = useCallback(
    (id) => {
      Animated.spring(getCardScale(id), { toValue: 0.97, useNativeDriver: true }).start()
    },
    [getCardScale],
  )

  const handleCardPressOut = useCallback(
    (id) => {
      Animated.spring(getCardScale(id), { toValue: 1, useNativeDriver: true }).start()
    },
    [getCardScale],
  )

  const memoizedData = useMemo(() => data, [data])

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AnimatedBackground darkMode={darkMode} />
      <HeaderSection darkMode={darkMode} username={username} role={role} navigation={navigation} />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.icon} />
          <Text style={[styles.loadingText, { color: colors.subtitle, marginTop: 12 }]}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={memoizedData}
          renderItem={({ item }) => {
            const itemColor = darkMode ? darkColors.icon : lightColors.icon
            const itemLightColor = darkMode ? darkColors.cardGradientLight : lightColors.cardGradientLight

            return (
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
                      borderLeftColor: itemColor,
                      backgroundColor: colors.cardBg,
                      transform: [{ scale: getCardScale(item.id) }],
                      shadowColor: itemColor,
                      shadowOpacity: darkMode ? 0.4 : 0.12,
                      shadowRadius: 16,
                    },
                  ]}
                >
                  <LinearGradient colors={[itemLightColor + "20", colors.cardBg]} style={styles.cardHeader}>
                    <Text style={[styles.iconText, { color: itemColor, fontSize: fontSize + 8 }]}>{item.icon}</Text>
                    <View style={styles.headerText}>
                      <Text
                        style={[
                          styles.catTitle,
                          { color: itemColor, fontSize: fontSize + 3, fontWeight: "800", letterSpacing: 1 },
                        ]}
                      >
                        {item.type}
                      </Text>
                      <Text style={[styles.itemCount, { color: colors.itemCount, fontSize: fontSize - 1 }]}>
                        ⟦ {item.titles.length} ITEMS ⟧
                      </Text>
                    </View>
                    <Text style={[styles.expandArrow, { color: itemColor, fontSize: 16 }]}>
                      {expandedId === item.id ? "▼" : "▶"}
                    </Text>
                  </LinearGradient>

                  {expandedId === item.id &&
                    item.titles.map((title, i) => (
                      <View
                        key={i}
                        style={[
                          styles.challengeRow,
                          { borderLeftColor: itemColor, backgroundColor: colors.cardBgHover },
                        ]}
                      >
                        <Text
                          style={[
                            styles.challengeTitle,
                            { fontSize, color: colors.hintText, flexShrink: 1, flexWrap: "wrap", fontWeight: "500" },
                          ]}
                        >
                          {title}
                        </Text>
                        <View style={styles.actionsRight}>
                          <TouchableOpacity
                            style={[styles.hintBtn, { borderColor: itemColor, backgroundColor: colors.hintBtnBg }]}
                            onPress={() => {
                              setHintVisible(true)
                              setCurrentHint(item.hints[i])
                            }}
                          >
                            <Text
                              style={[
                                styles.hintBtnText,
                                { color: itemColor, fontSize: fontSize - 1, fontWeight: "700" },
                              ]}
                            >
                              ?
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.openBtn,
                              {
                                backgroundColor: itemColor,
                                borderColor: itemColor,
                                borderWidth: 1,
                              },
                            ]}
                            onPress={() => Linking.openURL(item.urls[i])}
                          >
                            <Text
                              style={[
                                styles.openBtnText,
                                { fontSize: fontSize - 1, fontWeight: "800", color: colors.openBtnText },
                              ]}
                            >
                              OPEN
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </Animated.View>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
        />
      )}

      <Modal visible={hintVisible} transparent animationType="fade">
        <View style={styles.hintOverlay}>
          <View
            style={[
              styles.hintBox,
              {
                backgroundColor: colors.modalBg,
                borderColor: colors.modalBorder,
                shadowColor: colors.modalShadow,
                shadowOpacity: 0.3,
                shadowRadius: 24,
              },
            ]}
          >
            <View style={styles.hintHeader}>
              <Text style={[styles.hintTitle, { color: colors.headerBorder, fontWeight: "800", letterSpacing: 2 }]}>
                ⟦ HINT ⟧
              </Text>
            </View>
            <ScrollView style={styles.hintContent}>
              <Text style={[styles.hintText, { color: colors.hintText, fontSize, lineHeight: fontSize * 1.7 }]}>
                {currentHint}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={() => setHintVisible(false)}
              style={[styles.hintClose, { borderColor: colors.headerBorder, backgroundColor: colors.hintBtnBg }]}
            >
              <Text style={[styles.hintCloseText, { color: colors.headerBorder, fontWeight: "800" }]}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={() => setFontSize((f) => Math.max(10, f - 1))}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}
        >
          <Text style={[styles.fabText, { color: colors.fabText, fontWeight: "800" }]}>A−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFontSize(13)}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg, borderWidth: 2, borderColor: colors.glitchGreen }]}
        >
          <Text style={[styles.fabText, { color: colors.fabText, fontWeight: "800" }]}>⟲</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFontSize((f) => Math.min(22, f + 1))}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}
        >
          <Text style={[styles.fabText, { color: colors.fabText, fontWeight: "800" }]}>A+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDarkMode((d) => !d)}
          style={[styles.fabBtn, { backgroundColor: colors.fabBg }]}
        >
          <Text style={[styles.fabText, { fontSize: 16 }]}>{darkMode ? "☀" : "🌙"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* ---------------------- Enhanced Styles ---------------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    zIndex: 20,
    position: "relative",
  },
  headerCornerBracket: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: "#00E5FF",
    borderLeftColor: "#00E5FF",
  },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "900", letterSpacing: 2, marginBottom: 4 },
  headerSubtitle: { fontSize: 11, fontWeight: "600", letterSpacing: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerUser: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  adminBtn: { borderWidth: 2, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  adminText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },

  cardWrap: { marginVertical: 8, marginHorizontal: 14 },
  card: { borderLeftWidth: 4, borderRadius: 12, overflow: "hidden", shadowOffset: { width: 0, height: 4 } },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  iconText: { fontWeight: "800" },
  headerText: { flex: 1 },
  catTitle: { marginBottom: 3 },
  itemCount: { fontWeight: "600" },
  expandArrow: { marginLeft: 4, fontWeight: "800" },
  challengeRow: {
    marginVertical: 6,
    marginHorizontal: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeTitle: { flex: 1, marginRight: 8 },
  actionsRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  hintBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 2,
    minWidth: 32,
    alignItems: "center",
  },
  hintBtnText: {},
  openBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  openBtnText: {},

  list: { paddingBottom: 140 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },

  fabContainer: { position: "absolute", bottom: 28, right: 18, flexDirection: "row", gap: 10 },
  fabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: { fontSize: 14 },

  hintOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000077" },
  hintBox: { width: "88%", borderRadius: 14, borderWidth: 2, padding: 18, maxHeight: "75%" },
  hintHeader: { marginBottom: 14 },
  hintTitle: { fontSize: 16 },
  hintContent: { maxHeight: "80%" },
  hintText: { fontSize: 12 },
  hintClose: { marginTop: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 2, alignItems: "center" },
  hintCloseText: { fontSize: 12 },
})
