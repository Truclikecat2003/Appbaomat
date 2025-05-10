import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';  
import HomeScreen from './screens/HomeScreen';
import XacThucOtpScreen from './screens/XacThucOtpScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Only 'Screen' components should be direct children of the navigator */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
         <Stack.Screen name="XacThucOtpScreen" component={XacThucOtpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
