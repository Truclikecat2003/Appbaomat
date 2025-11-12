"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useState, useCallback } from "react"
import { LinearGradient } from "expo-linear-gradient"

const MenuComponent = ({ username, role, email }) => {
  const navigation = useNavigation()
  const [activeItem, setActiveItem] = useState(null)
  const userData = { username, role, email }

  // ✅ Reset menu khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      setActiveItem(null)
    }, [])
  )

  const menuItems = [
    {
      id: "documents",
      label: "Tài liệu",
      icon: "book-outline",
      description: "Trang bị các kiến thức cần thiết để phát triển bản thân và sự nghiệp.",
      screen: "TailieuScreen",
    },
    {
      id: "personal",
      label: "Thông tin cá nhân",
      icon: "account-circle-outline",
      description: "Chỉnh sửa và quản lý thông tin cá nhân của bạn.",
      screen: "ThongtinScreen",
    },
    {
      id: "feedback",
      label: "Đóng góp ý kiến",
      icon: "message-text-outline",
      description: "Gửi phản hồi và ý kiến của bạn.",
      screen: "GopYScreen",
    },
    {
      id: "history",
      label: "Lịch sử góp ý",
      icon: "history",
      description: "Xem lại các ý kiến bạn đã gửi.",
      screen: "LichSuGopYScreen",
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: "bell-outline",
      description: "Quản lý và xem các thông báo quan trọng.",
      screen: "ThongBaoScreen",
    },
  ]

  const handlePress = (item) => {
    setActiveItem(item.id)
    navigation.navigate(item.screen, { userData })
  }

  return (
    <View style={enterpriseStyles.menuContainer}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[enterpriseStyles.button, activeItem === item.id && enterpriseStyles.buttonActive]}
          onPress={() => handlePress(item)}
          activeOpacity={0.7}
        >
          {activeItem === item.id && (
            <LinearGradient
              colors={["#0369a1", "#06b6d4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={enterpriseStyles.gradientBg}
            />
          )}

          <View style={[enterpriseStyles.accentBar, activeItem !== item.id && enterpriseStyles.accentBarInactive]}>
            {activeItem === item.id && (
              <LinearGradient
                colors={["#06b6d4", "#e9690eff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={enterpriseStyles.accentGradient}
              />
            )}
          </View>

          {/* icon màu nền */}
          <View style={enterpriseStyles.iconContainer}>
            <Icon
              name={item.icon}
              size={20}
              color={activeItem === item.id ? "#ffffff" : "#1c2026ff"}
              style={enterpriseStyles.icon}
            />
          </View>

          <View style={enterpriseStyles.contentContainer}>
            <Text style={[enterpriseStyles.menuText, activeItem === item.id && enterpriseStyles.menuTextActive]}>
              {item.label}
            </Text>
            <Text style={enterpriseStyles.menuSubtext}>{item.description}</Text>
          </View>

          <View style={[enterpriseStyles.chevronContainer, activeItem === item.id && enterpriseStyles.chevronActive]}>
            <Icon
              name="chevron-right"
              size={18}
              color={activeItem === item.id ? "#06b6d4" : "#64748b"}
              style={enterpriseStyles.chevron}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const enterpriseStyles = StyleSheet.create({
  menuContainer: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: "#0f172a",
    borderRadius: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0A0F1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#122456ff",
    overflow: "hidden",
    position: "relative",
  },
  buttonActive: {
    backgroundColor: "#1e293b",
    borderColor: "#0ea5e9",
    borderWidth: 1.5,
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
  },
  accentBar: {
    width: 3,
    height: "100%",
    marginLeft: -16,
    marginRight: 14,
    borderRadius: 3,
    backgroundColor: "#0564eaff",
    opacity: 0.4,
  },
  accentBarInactive: {
    backgroundColor: "#1765d2ff",
    opacity: 0.3,
  },
  accentGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 3,
  },
  // nền icon
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#05eff7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  // màu chính
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#06b63eff",
    letterSpacing: 0.3,
  },
  menuTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  // màu phụ
  menuSubtext: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  chevronActive: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  chevron: {
    marginLeft: 2,
  },
})

export default MenuComponent
