import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const Footer = ({ onNavPress }) => {
  const navItems = [
    { icon: "home-outline", label: "Trang chủ", color: "#06b6d4", id: "home" },
    { icon: "shield-check-outline", label: "Kiểm tra", color: "#10b981", id: "check" },
    { icon: "clock-outline", label: "Báo cáo", color: "#ef4444", id: "report" },
    { icon: "chart-bar", label: "Thống kê", color: "#8b5cf6", id: "stats" },
    { icon: "account-circle-outline", label: "Hộ số", color: "#f59e0b", id: "profile" },
  ]

  return (
    <View style={styles.footer}>
      {navItems.map((btn) => (
        <TouchableOpacity
          key={btn.id}
          style={styles.footerBtn}
          activeOpacity={0.7}
          onPress={() => onNavPress?.(btn.id)}
        >
          <View style={[styles.footerIconBg, { borderColor: btn.color + "40" }]}>
            <Icon name={btn.icon} size={22} color={btn.color} />
          </View>
          <Text style={styles.footerText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#10b98130",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBtn: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
  },
  footerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    backgroundColor: "#0a0f1c",
  },
  footerText: {
    color: "#cbd5e1",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
})

export default Footer
