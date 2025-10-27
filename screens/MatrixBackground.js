import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const kyTuMa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*".split("");

export default function MatrixBackground() {
  const [matrixData, setMatrixData] = useState([]);
  const columns = 25;
  const rows = 60;

  useEffect(() => {
    const init = Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => kyTuMa[Math.floor(Math.random() * kyTuMa.length)])
    );
    setMatrixData(init);

    const interval = setInterval(() => {
      setMatrixData((prev) =>
        prev.map((col) =>
          col.map(() => kyTuMa[Math.floor(Math.random() * kyTuMa.length)])
        )
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const rainAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rainAnim, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(rainAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = rainAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 1.5],
  });

  return (
    <Animated.View style={{ position: "absolute", width: "100%", height: "300%", transform: [{ translateY }] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {matrixData.map((col, i) => (
          <View key={i}>
            {col.map((char, j) => (
              <Text key={j} style={{ color: "#00FFAA", opacity: Math.random() * 0.8 + 0.2, fontFamily: "monospace", fontSize: 13 }}>
                {char}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <LinearGradient colors={["rgba(0,0,0,0.9)", "rgba(0,40,20,0.95)"]} style={{ position: "absolute", width: "100%", height: "100%" }} />
    </Animated.View>
  );
}
