// Import các thư viện cần thiết từ Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, update } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// 🆕 Import thêm các hàm liên quan đến Authentication
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUzXSGJ96qPKBOBep_6mL3xMuy2D-BmXg",
  authDomain: "lab4-8ea2b.firebaseapp.com",
  projectId: "lab4-8ea2b",
  storageBucket: "lab4-8ea2b.appspot.com",  
  messagingSenderId: "467003136966",
  appId: "1:467003136966:web:e2cc902736d8a18d2d30c7",
  measurementId: "G-K2HRLHVZPC"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database
const database = getDatabase(app);

// Khởi tạo Firebase Storage
const storage = getStorage(app);

// 🆕 Khởi tạo Firebase Authentication
const auth = getAuth(app);

// Xuất database, ref, get, set, push và storage để sử dụng ở các file khác
export { database, ref, get, set, push, storage, update };

// 🆕 Xuất thêm các hàm và biến dùng cho Authentication
export { auth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged };
