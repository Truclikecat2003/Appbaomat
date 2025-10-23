// BanhrangIcon.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BanhrangIcon({ size = 120 }) {
  const assemble = useRef(new Animated.Value(0)).current; // kiểm soát thứ tự xuất hiện
  const fadeText = useRef(new Animated.Value(0)).current; // text fade

  const translatePositions = [
    { x: -size / 2, y: -size / 2 }, // trái trên
    { x: size / 2, y: -size / 2 },  // phải trên
    { x: size / 2, y: size / 2 },   // phải dưới
    { x: -size / 2, y: size / 2 },  // trái dưới
  ];

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(assemble, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(assemble, {
          toValue: 2,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(assemble, {
          toValue: 3,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(assemble, {
          toValue: 4,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(assemble, {
          toValue: 5,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(fadeText, { toValue: 1, duration: 400, useNativeDriver: false }),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(assemble, { toValue: 0, duration: 0, useNativeDriver: false }),
          Animated.timing(fadeText, { toValue: 0, duration: 0, useNativeDriver: false }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const iconScale = assemble.interpolate({
    inputRange: [0, 5],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.wrapper}>
      <View style={{ position: 'absolute' }}>
        {translatePositions.map((pos, idx) => {
          const show = assemble.interpolate({
            inputRange: [idx + 0.8, idx + 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={idx}
              style={{
                position: 'absolute',
                opacity: show,
                transform: [
                  { translateX: show.interpolate({ inputRange: [0, 1], outputRange: [pos.x, 0] }) },
                  { translateY: show.interpolate({ inputRange: [0, 1], outputRange: [pos.y, 0] }) },
                  { scale: iconScale },
                ],
              }}
            >
              <Ionicons
                name="settings-sharp"
                size={size / 2}
                color="#b84dff"
                style={{ backgroundColor: 'transparent' }}
              />
            </Animated.View>
          );
        })}

        {/* Icon trung tâm */}
        <Animated.View
          style={{
            opacity: assemble.interpolate({ inputRange: [4.8, 5], outputRange: [0, 1], extrapolate: 'clamp' }),
            transform: [{ scale: iconScale }],
          }}
        >
          <Ionicons
            name="settings-sharp"
            size={size / 2}
            color="#4df0ff"
            style={{
              backgroundColor: 'transparent',
              textShadowColor: '#b84dff',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          />
        </Animated.View>
      </View>

      <Animated.Text style={[styles.text, { opacity: fadeText }]}>Đang tải</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    marginTop: 10,
    color: '#4df0ff',
    fontWeight: '700',
    fontSize: 16,
    textShadowColor: '#b84dff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    backgroundColor: 'transparent',
  },
});
