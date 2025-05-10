// import React, { useState } from 'react';
// import { Text, StyleSheet } from 'react-native';
// import { Formik } from 'formik';
// import auth from '@react-native-firebase/auth';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// // import {
// //   View,
// //   TextInput,
// //   Logo,
// //   Button,
// //   FormErrorMessage
// // } from '../components';
// import { Images, Colors } from '../config';
// //import { useTogglePasswordVisibility } from '../hooks/useTogglePasswordVisibility';
// // import { signupValidationSchema } from '../utils';
// //import { Button, TextInput, FormErrorMessage } from '../components';
// import Button from '../components/Button';
// import FormErrorMessage from '../components/FormErrorMessage'
// import { TextInput } from '../components/TextInput';

// export const SignupScreen = ({ navigation }) => {
//   const [errorState, setErrorState] = useState('');

//   const {
//     passwordVisibility,
//     handlePasswordVisibility,
//     rightIcon,
//     handleConfirmPasswordVisibility,
//     confirmPasswordIcon,
//     confirmPasswordVisibility
//   } = useTogglePasswordVisibility();

//   const handleSignup = async (values) => {
//     const { email, password } = values;
//     auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(
//         ()=>navigation.navigate('Login')
//       )
//       .catch(error => setErrorState(error.message));
//   };

//   return (
//     <View isSafe style={styles.container}>
//       <KeyboardAwareScrollView enableOnAndroid={true}>
//         {/* Logo + Title */}
//         <View style={styles.logoContainer}>
//           <Logo uri={Images.logo} />
//           <Text style={styles.screenTitle}>Create a new account!</Text>
//         </View>

//         {/* Formik Wrapper */}
//         <Formik
//           initialValues={{
//             email: '',
//             password: '',
//             confirmPassword: ''
//           }}
//           validationSchema={signupValidationSchema}
//           onSubmit={handleSignup}
//         >
//           {({
//             values,
//             touched,
//             errors,
//             handleChange,
//             handleSubmit,
//             handleBlur
//           }) => (
//             <>
//               {/* Email Input */}
//               <TextInput
//                 name="email"
//                 leftIconName="email"
//                 placeholder="Enter email"
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 textContentType="emailAddress"
//                 autoFocus={true}
//                 value={values.email}
//                 onChangeText={handleChange('email')}
//                 onBlur={handleBlur('email')}
//               />
//               <FormErrorMessage error={errors.email} visible={touched.email} />

//               {/* Password Input */}
//               <TextInput
//                 name="password"
//                 leftIconName="key-variant"
//                 placeholder="Enter password"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 secureTextEntry={passwordVisibility}
//                 textContentType="newPassword"
//                 rightIcon={rightIcon}
//                 handlePasswordVisibility={handlePasswordVisibility}
//                 value={values.password}
//                 onChangeText={handleChange('password')}
//                 onBlur={handleBlur('password')}
//               />
//               <FormErrorMessage error={errors.password} visible={touched.password} />

//               {/* Confirm Password Input */}
//               <TextInput
//                 name="confirmPassword"
//                 leftIconName="key-variant"
//                 placeholder="Enter password"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 secureTextEntry={confirmPasswordVisibility}
//                 textContentType="password"
//                 rightIcon={confirmPasswordIcon}
//                 handlePasswordVisibility={handleConfirmPasswordVisibility}
//                 value={values.confirmPassword}
//                 onChangeText={handleChange('confirmPassword')}
//                 onBlur={handleBlur('confirmPassword')}
//               />
//               <FormErrorMessage
//                 error={errors.confirmPassword}
//                 visible={touched.confirmPassword}
//               />

//               {/* Error Message */}
//               {errorState !== '' && (
//                 <FormErrorMessage error={errorState} visible={true} />
//               )}

//               {/* Signup Button */}
//               <Button style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Signup</Text>
//               </Button>
//             </>
//           )}
//         </Formik>

//         {/* Navigation Button */}
//         <Button
//           style={styles.borderlessButtonContainer}
//           borderless
//           title={'Already have an account?'}
//           onPress={()  => navigation.navigate('Login')}
//             // console.log('Create Account success!')}
//         />
//       </KeyboardAwareScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     paddingHorizontal: 12
//   },
//   logoContainer: {
//     alignItems: 'center'
//   },
//   screenTitle: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: Colors.black,
//     paddingTop: 20
//   },
//   button: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 8,
//     backgroundColor: Colors.orange,
//     padding: 10,
//     borderRadius: 8
//   },
//   buttonText: {
//     fontSize: 20,
//     color: Colors.white,
//     fontWeight: '700'
//   },
//   borderlessButtonContainer: {
//     marginTop: 16,
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });
// screens/SignupScreen.js
// screens/SignupScreen.js
// screens/SignupScreen.js

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thư viện icon

export default function SignupScreen() {
  const [email, setEmail] = useState(''); // Trạng thái lưu email
  const [password, setPassword] = useState(''); // Trạng thái lưu mật khẩu
  const [confirmPassword, setConfirmPassword] = useState(''); // Trạng thái lưu mật khẩu xác nhận
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái hiển thị mật khẩu xác nhận

  // Hàm xử lý đăng ký
  const handleSignup = () => {
    // Kiểm tra nếu có trường nào bị bỏ trống
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra nếu mật khẩu và mật khẩu xác nhận không khớp
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và mật khẩu xác nhận không trùng khớp');
      return;
    }

    // Thông báo thành công
    Alert.alert('Đăng ký thành công!');
    setEmail(''); // Xóa email sau khi đăng ký
    setPassword(''); // Xóa mật khẩu sau khi đăng ký
    setConfirmPassword(''); // Xóa mật khẩu xác nhận sau khi đăng ký
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh ở trên tiêu đề, lấy từ thư mục assets */}
      <Image 
        source={require('../assets/meo.jpg')} // Đường dẫn đến hình ảnh trong thư mục assets
        style={styles.image}
      />

      {/* Tiêu đề của màn hình */}
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      {/* Nhập email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      
      {/* Nhập mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Nếu showPassword là false, mật khẩu sẽ bị ẩn
          style={styles.input}
        />
        {/* Nút hiện mật khẩu */}
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)} // Đổi trạng thái hiển thị mật khẩu khi nhấn
        >
          {/* Con mắt đen */}
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#000000" />  
        </TouchableOpacity>
      </View>

      {/* Nhập lại mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword} // Nếu showConfirmPassword là false, mật khẩu sẽ bị ẩn
          style={styles.input}
        />
        {/* Nút hiện mật khẩu xác nhận */}
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)} // Đổi trạng thái hiển thị mật khẩu xác nhận khi nhấn
        >
          <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#000000" />  {/* Con mắt đen */}
        </TouchableOpacity>
      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Đăng ký</Text>  {/* Bao bọc văn bản trong thẻ Text */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container của màn hình
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  // Tiêu đề của màn hình
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  // Style cho ô nhập liệu
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  // Style cho nút đăng ký
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#007BFF',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Container chứa mật khẩu và icon
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  // Vị trí của icon mắt
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  // Style cho hình ảnh
  image: {
    width: 100, // Đặt chiều rộng của hình ảnh
    height: 100, // Đặt chiều cao của hình ảnh
    marginBottom: 20, // Khoảng cách giữa hình ảnh và tiêu đề
  },
});
