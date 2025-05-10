import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';  
 

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
  navigation.navigate('LoginScreen'); // Thay bằng màn hình login của bạn
};

  useLayoutEffect(() => {
  navigation.setOptions({
    title: 'Home',
    headerLeft: () => null, // Ẩn nút quay lại
    headerRight: () => (
      <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
        <Ionicons name="log-out-outline" size={24} color="black" />
      </TouchableOpacity>
    ),
  });
}, [navigation]);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default HomeScreen;
