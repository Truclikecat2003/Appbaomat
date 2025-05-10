import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from '@react-native-firebase/analytics';  // Import analytics SDK

const firebaseConfig = {
  apiKey: "AIzaSyDUzXSGJ96qPKBOBep_6mL3xMuy2D-BmXg",
  authDomain: "lab4-8ea2b.firebaseapp.com",
  projectId: "lab4-8ea2b",
  storageBucket: "lab4-8ea2b.firebasestorage.app",
  messagingSenderId: "467003136966",
  appId: "1:467003136966:web:e2cc902736d8a18d2d30c7",
  measurementId: "G-K2HRLHVZPC"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Kiểm tra xem Analytics có được hỗ trợ không
let analytics;
if (isSupported()) {
  analytics = getAnalytics(app);  // Chỉ khởi tạo analytics nếu hỗ trợ
}

export { analytics };  // Expose analytics nếu có

import { getDatabase, ref, set, push } from "firebase/database";  // Thêm dòng này

export const db = getDatabase(app);  // Khởi tạo Realtime Database
export { ref, set, push };           // Xuất các hàm để dùng ở file khác
