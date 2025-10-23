"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"

export default function GearLoader() {
  const rotations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  const scales = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  useEffect(() => {
    // Hiệu ứng scale in từng mảnh bánh răng
    scales.forEach((scale, index) => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    })

    // Hiệu ứng quay từng mảnh
    rotations.forEach((rotation, index) => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()
    })
  }, [])

  const getRotateStyle = (index) => {
    const rotate = rotations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    })
    return { transform: [{ rotate }] }
  }

  const getScaleStyle = (index) => {
    return { transform: [{ scale: scales[index] }] }
  }

  return (
    <View style={styles.container}>
      <View style={styles.gearGrid}>
        {/* Top-Left Gear */}
        <Animated.View style={[styles.gearPiece, styles.topLeft, getRotateStyle(0), getScaleStyle(0)]}>
          <Text style={styles.gearText}>⚙️</Text>
        </Animated.View>

        {/* Top-Right Gear */}
        <Animated.View style={[styles.gearPiece, styles.topRight, getRotateStyle(1), getScaleStyle(1)]}>
          <Text style={styles.gearText}>⚙️</Text>
        </Animated.View>

        {/* Bottom-Left Gear */}
        <Animated.View style={[styles.gearPiece, styles.bottomLeft, getRotateStyle(2), getScaleStyle(2)]}>
          <Text style={styles.gearText}>⚙️</Text>
        </Animated.View>

        {/* Bottom-Right Gear */}
        <Animated.View style={[styles.gearPiece, styles.bottomRight, getRotateStyle(3), getScaleStyle(3)]}>
          <Text style={styles.gearText}>⚙️</Text>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
  },
  gearGrid: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gearPiece: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderWidth: 1.5,
    borderColor: "#00d4ff",
    shadowColor: "#00d4ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  gearText: {
    fontSize: 28,
  },
})
