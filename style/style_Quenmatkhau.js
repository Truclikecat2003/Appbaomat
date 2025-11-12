import { StyleSheet, Platform } from "react-native"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000814", alignItems: "center", justifyContent: "center" },
  gridLayer: { position: "absolute", width: "100%", height: "100%" },
  gridH: { position: "absolute", height: 1, width: "100%", backgroundColor: "rgba(0,240,255,0.04)" },
  gridV: { position: "absolute", width: 1, height: "100%", backgroundColor: "rgba(0,240,255,0.035)" },
  holographicOverlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(255,0,255,0.02)" },
  circuits: { position: "absolute", width: "120%", height: "120%", left: "-10%", top: "-8%", pointerEvents: "none" },
  circuitLine: {
    position: "absolute", height: 2, width: "120%", backgroundColor: "rgba(0,240,255,0.14)",
    shadowColor: "#00F0FF", shadowRadius: 10,
  },
  scanBeam: {
    position: "absolute", left: 0, right: 0, height: 120,
    backgroundColor: "rgba(0,240,255,0.08)", shadowColor: "#00F0FF", shadowRadius: 32, shadowOpacity: 0.7,
  },
  particleLayer: { position: "absolute", width: "100%", height: "100%" },
  particle: {
    position: "absolute", borderRadius: 50, shadowRadius: 8,
    shadowOpacity: Platform.OS === "ios" ? 0.95 : 0.7,
  },
  cornerBracket: { position: "absolute", width: 24, height: 24, borderColor: "#00F0FF", borderWidth: 2 },
  topLeft: { top: 60, left: 20, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 60, right: 20, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 60, left: 20, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 60, right: 20, borderLeftWidth: 0, borderTopWidth: 0 },
  formWrap: {
    width: "88%", maxWidth: 800, backgroundColor: "rgba(5,10,20,0.55)", paddingVertical: 32, paddingHorizontal: 24,
    borderRadius: 12, borderWidth: 2, alignItems: "center", shadowColor: "#00F0FF", shadowRadius: 28,
    shadowOpacity: 0.15, overflow: "hidden",
  },
  laserTop: {
    position: "absolute", top: -10, left: 12, right: 12, height: 5, borderRadius: 4,
    backgroundColor: "rgba(0,255,255,0.7)", shadowColor: "#00F0FF", shadowRadius: 24, shadowOpacity: 0.95,
  },
  laserBottom: {
    position: "absolute", bottom: -10, left: 12, right: 12, height: 4, borderRadius: 4,
    backgroundColor: "rgba(0,255,255,0.5)", shadowColor: "#00F0FF", shadowRadius: 20, shadowOpacity: 0.8,
  },
  brand: {
    color: "#E0FFFF", fontSize: 32, letterSpacing: 3, fontWeight: "900", marginBottom: 8,
    textShadowColor: "#00F0FF", textShadowRadius: 14,
  },
  tag: { color: "#00F0FF", fontSize: 16, marginBottom: 4, letterSpacing: 2, fontWeight: "700" },
  status: { color: "#00FF88", fontSize: 22, marginBottom: 20, letterSpacing: 1, fontWeight: "bold" },
  inputRow: {
    width: "100%", backgroundColor: "rgba(0,240,255,0.04)", borderRadius: 8, borderWidth: 1.5,
    borderColor: "rgba(0,240,255,0.18)", paddingHorizontal: 14, height: 56, marginBottom: 14,
    alignItems: "center", flexDirection: "row",
  },
  inputRowFocused: {
    backgroundColor: "rgba(0,240,255,0.08)", borderColor: "rgba(0,240,255,0.6)",
    shadowColor: "#00F0FF", shadowRadius: 12, shadowOpacity: 0.3,
  },
  input: { flex: 1, color: "#E0FFFF", fontSize: 15, paddingVertical: 8, fontWeight: "500" },
  infoText: { color: "#4A9FB5", fontSize: 12, marginBottom: 16, fontWeight: "500", textAlign: "center", letterSpacing: 0.5 },
  btnContainer: { width: "100%", marginTop: 8 },
  btn: {
    width: "100%", backgroundColor: "rgba(0,240,255,0.92)", paddingVertical: 14, borderRadius: 8,
    alignItems: "center", borderWidth: 1.5, borderColor: "rgba(0,255,255,0.3)",
    shadowColor: "#00F0FF", shadowRadius: 16, shadowOpacity: 0.4,
  },
  btnText: { color: "#000814", fontWeight: "900", letterSpacing: 1.5, fontSize: 14 },
  readout: { marginTop: 18, alignItems: "center", paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,240,255,0.15)" },
  readoutText: { color: "#4A9FB5", fontSize: 14, letterSpacing: 0.5, fontWeight: "600" },
})

export default styles
