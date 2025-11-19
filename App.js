import 'react-native-gesture-handler';
import React from 'react';
import Toast from 'react-native-toast-message'
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
import TestDangKy from './test/test_dangky';
import TestDangNhap from './test/test_dangnhap';
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
import QuanLyTaiLieuScreen from './screens/QuanLyTaiLieu';
import DoiMatKhauScreen from './screens/DoiMatKhauScreen';
import QuenMatKhauScreen from './screens/QuenMatKhauScreen';
import Home_Email from './Code/email/home_email';
// import 'react-native-get-random-values';
import ChiTiet_Email from './Code/email/chitiet_email';
import CheckEmails from './Code/email/check-emails';
import ThongKeVaCanhBao from './Code/email/thongkevacanhbao_email';
import Themnhieu_email from './Code/email/Themnhieu_email';
import AD_trungtamhotro from './Code/email/AD_trungtamhotro';
import AD_LoaiCauhoihotro from './Code/PhanhoiHotro/AD_LoaiCauhoihotro';
import AD_QuanlyLoaiCauhoi from './Code/PhanhoiHotro/AD_QuanlyLoaiCauhoi';
import ThemMailMau from './Code/email/themmailmau';
import HienthiEmail from './Code/email/hienthi_email';
import QuanLyHienthiEmail from './Code/email/quan_ly_hienthi_email';
import { RichTextDisplay } from './Code/email/rich-text-display';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Themnhieu_email">
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
        <Stack.Screen name="QuanLyTaiLieu" component={QuanLyTaiLieuScreen} options={{ title: 'Quản Lý Tài Liệu' }} />
        <Stack.Screen name="DoiMatKhauScreen" component={DoiMatKhauScreen} options={{ title: 'Đổi Mật Khẩu' }} />
        <Stack.Screen name="QuenMatKhauScreen" component={QuenMatKhauScreen} options={{ title: 'Quên Mật Khẩu' }} />
        <Stack.Screen name="TestDangKy" component={TestDangKy} />
        <Stack.Screen name="TestDangNhap" component={TestDangNhap} />
        <Stack.Screen name="Home_Email" component={Home_Email} options={{ title: 'Cảnh báo lừa đảo trực tuyến' }} />
        <Stack.Screen name="ChiTiet_Email" component={ChiTiet_Email} options={{ title: 'Chi Tiết Email' }} />
        <Stack.Screen name="CheckEmails" component={CheckEmails} options={{ title: 'Kiểm tra Email' }} />
        <Stack.Screen name="ThongKeVaCanhBao" component={ThongKeVaCanhBao} options={{ title: 'Thống kê và cảnh báo' }} />
        <Stack.Screen name="Themnhieu_email" component={Themnhieu_email} options={{ title: 'Thêm nhiều email' }} />
        <Stack.Screen name="AD_trungtamhotro" component={AD_trungtamhotro} options={{ title: 'Quản lý trung tâm hỗ trợ' }} />
        <Stack.Screen name="AD_LoaiCauhoihotro" component={AD_LoaiCauhoihotro} options={{ title: 'Quản lý loại câu hỏi hỗ trợ' }} />
        <Stack.Screen name="AD_QuanlyLoaiCauhoi" component={AD_QuanlyLoaiCauhoi} options={{ title: 'Quản lý loại câu hỏi hỗ trợ' }} />
        <Stack.Screen name="ThemMailMau" component={ThemMailMau} options={{ title: 'Thêm email mẫu' }} />
        <Stack.Screen name="HienthiEmail" component={HienthiEmail} options={{ title: 'Hiển thị email' }} />
        <Stack.Screen name="QuanLyHienthiEmail" component={QuanLyHienthiEmail} options={{ title: 'Quản lý hiển thị email' }} />
        <Stack.Screen name="RichTextDisplay" component={RichTextDisplay} options={{ title: 'Rich Text Display' }} />
        

      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
