"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"

export default function SplashScreen({ onFinish }) {
  const spinValue = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(0.8)).current
  const opacityValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Hiệu ứng quay bánh răng
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()

    // Hiệu ứng fade in và scale
    Animated.parallel([
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()

    // Tự động chuyển sang LoginScreen sau 3.5 giây
    const timer = setTimeout(() => {
      onFinish()
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      {/* Gradient background effect */}
      <View style={styles.gradientOverlay} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Bánh răng SVG */}
        <Animated.View
          style={[
            styles.gearContainer,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <Text style={styles.gearEmoji}>⚙️</Text>
        </Animated.View>

        {/* Text THANHTRUC */}
        <Text style={styles.brandText}>THANHTRUC</Text>

      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: Animated.timing(new Animated.Value(0), {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
            },
          ]}
        />
        <Animated.View style={[styles.dot, { marginLeft: 8 }]} />
        <Animated.View style={[styles.dot, { marginLeft: 8 }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e27",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 14, 39, 0.95)",
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
  gearContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  gearEmoji: {
    fontSize: 100,
  },
  brandText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#00d4ff",
    letterSpacing: 3,
    marginBottom: 8,
    textShadowColor: "rgba(0, 212, 255, 0.5)",
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#7a8ba8",
    letterSpacing: 1.5,
    fontWeight: "300",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d4ff",
    opacity: 0.6,
  },
})
