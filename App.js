// // screens/SignupScreen.js
// import React from 'react';
// import { View, Text } from 'react-native';
// import SignupScreen from './screens/SignupScreen';
// export default function SignupScreen() {
//   try {
//     // Gây lỗi thử
//     // throw new Error("Lỗi giả lập để test");

//     return (
//       <View>
//         <Text>Đăng ký</Text>
//         {/* <SignupScreen /> */}
//       </View>
//     );
//   } catch (err) {
//     console.error("Lỗi trong SignupScreen:", err);
//     return (
//       <View>
//         <SignupScreen />
//         <Text style={{ color: 'red' }}>Lỗi: {err.message}</Text>
//       </View>
//     );
//   }
// }
import React from 'react';
import SignupScreen from './screens/SignupScreen';  

export default function App() {
  return (
    <SignupScreen />
  );
}
