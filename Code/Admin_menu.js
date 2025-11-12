"use client"

import { useRef, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"

const Admin_menu = ({ username, role, email }) => {
  const navigation = useNavigation()
  const userData = { username, role, email}

  const menuItems = [
    { title: "Tài liệu", icon: "file-document-outline", screen: "TailieuScreen" },
    { title: "Thông tin cá nhân", icon: "account-outline", screen: "ThongtinScreen" },
    { title: "Quản lý người dùng", icon: "account-group-outline", screen: "Admin_Quanlyuser" },
    { title: "Lịch sử góp ý", icon: "chart-timeline-variant", screen: "Admin_LichSuGopYScreen" },
    { title: "Phản hồi", icon: "message-reply-text-outline", screen: "PhanHoi" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>CONTROL PANEL</Text>
        <View style={styles.headerLine} />
      </View>

      {menuItems.map((item, index) => (
        <CyberButton
          key={index}
          title={item.title}
          icon={item.icon}
          onPress={() => navigation.navigate(item.screen, { userData })}
        />
      ))}
    </View>
  )
}

const CyberButton = ({ title, icon, onPress }) => {
  const glowAnim = useRef(new Animated.Value(0)).current
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = () => {
    setIsPressed(true)
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => setIsPressed(false))
    onPress()
  }

  const shadowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff00", "#ffffff15"],
  })

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2d3748", "#4a5568"],
  })

  const bgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0f1419", "#12151f"],
  })

  return (
    <Animated.View
      style={[
        styles.buttonWrap,
        {
          shadowColor,
          borderColor,
          backgroundColor: bgColor,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress} style={styles.button}>
        <Icon name={icon} size={20} color="#9ca3af" style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
        <Icon name="chevron-right" size={18} color="#6b7280" style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080c12",
    padding: 20,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 32,
  },
  header: {
    color: "#f3f4f6",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2.2,
    marginBottom: 12,
    textAlign: "left",
  },
  headerLine: {
    height: 1,
    backgroundColor: "#1f2937",
    width: "100%",
  },
  buttonWrap: {
    marginVertical: 10,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: "#0f1419",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 14,
  },
  text: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.5,
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
})

export default Admin_menu
