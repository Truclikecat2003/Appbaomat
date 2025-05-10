import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
// import auth from '@react-native-firebase/auth';

export const HomeScreen = () => {
  const handleLogout = () => {
    // auth()
    //   .signOut()
    //   .catch((error) => console.log('Error logging out: ', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello ABX</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});
