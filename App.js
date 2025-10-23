import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';  
import HomeScreen from './screens/HomeScreen';
import XacThucOtpScreen from './screens/XacThucOtpScreen';
import TailieuScreen from './screens/tailieu';
import DanhBaScreen from './screens/DanhBaScreen';
import ThongtinScreen from './screens/ThongtinScreen';
import GopYScreen from './screens/GopYScreen';
import LichSuGopYScreen from './screens/LichSuGopYScreen';

import CacBaiTrain from './Code/CacBaiTrain';
import MoPhongLuaDaoScreen from './screens/MoPhongLuaDaoScreen';
import AdminScreen from './screens/AdminScreen';
import QLTrain from './Code/QLTrain';
import Admin_LichSuGopYScreen from './screens/Admin_LichSuGopYScreen';
import Admin_Quanlyuser from './screens/Admin_Quanlyuser';
import PhanHoi from './Code/PhanHoi';
import ThongBaoScreen from './screens/ThongBaoScreen';
import QuanlyScreen from './screens/QuanlyScreen';
import MophongScreen from './screens/MophongScreen';
import BaomatScreen from './screens/BaomatScreen';
import Banhrang from './components/banhrang';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Only 'Screen' components should be direct children of the navigator */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ title: 'Đăng ký' }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ title: 'Quên mật khẩu' }}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang chủ' }}/>
         <Stack.Screen name="XacThucOtpScreen" component={XacThucOtpScreen} options={{ title: 'Xác thực OTP' }} />
          <Stack.Screen name="TailieuScreen" component={TailieuScreen} options={{ title: 'Tài liệu' }} />
          <Stack.Screen name="DanhBaScreen" component={DanhBaScreen} options={{ title: 'Danh bạ' }} />
          <Stack.Screen name="ThongtinScreen" component={ThongtinScreen} options={{ title: 'Thông tin cá nhân' }} />
          <Stack.Screen name="GopYScreen" component={GopYScreen} options={{ title: 'Hộp thư góp ý' }} />
          <Stack.Screen name="LichSuGopYScreen" component={LichSuGopYScreen} options={{ title: 'Lịch sử góp ý' }} />
           <Stack.Screen name="CacBaiTrain" component={CacBaiTrain} />
          <Stack.Screen name="MoPhongLuaDaoScreen" component={MoPhongLuaDaoScreen} options={{title: 'Mô phỏng lừa đảo'}}/>
          <Stack.Screen name="AdminScreen" component={AdminScreen} />
          <Stack.Screen name="QLTrain" component={QLTrain} />
          <Stack.Screen name="Admin_LichSuGopYScreen" component={Admin_LichSuGopYScreen} options={{ title: 'Lịch sử góp ý của tất cả user' }} />
          <Stack.Screen name="Admin_Quanlyuser" component={Admin_Quanlyuser} options={{ title: 'Quản lý người dùng' }} />
          <Stack.Screen name="PhanHoi" component={PhanHoi} />
          <Stack.Screen name="ThongBaoScreen" component={ThongBaoScreen} />
          <Stack.Screen name="QuanlyScreen" component={QuanlyScreen} />
          <Stack.Screen name="MophongScreen" component={MophongScreen} options={{ title: 'Mô phỏng lừa đảo' }}/>
          <Stack.Screen name="BaomatScreen" component={BaomatScreen} />
          <Stack.Screen name="Banhrang" component={Banhrang} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
