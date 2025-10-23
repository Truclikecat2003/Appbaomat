// // DanhbaScreen.js
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity,
//   StyleSheet, ScrollView, Alert, Linking
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { database } from '../firebaseConfig'; 
// import { ref, set } from 'firebase/database';

// const data = {
//   "👨‍💻 Chuyên gia bảo mật": [
//     { id: '1', name: 'Nguyễn Văn An', email: 'an.nguyen@securetech.vn', phone: '0908123456', address: 'Hà Nội' },
//     { id: '2', name: 'Trần Thị Bích Hạnh', email: 'hanh.tran@securityhub.vn', phone: '0932456789', address: 'TP. HCM' },
//     { id: '3', name: 'Phạm Hữu Tài', email: 'tai.pham@cyberdefense.vn', phone: '0912987654', address: 'TP. Thủ Đức' },
//     { id: '4', name: 'Lê Hoàng Phúc', email: 'phuc.le@anminh.vn', phone: '0971324567', address: 'Đà Nẵng' },
//     { id: '5', name: 'Đặng Minh Châu', email: 'chau.dang@safezone.vn', phone: '0987634521', address: 'Nha Trang' }
//   ],

//   "🧑‍🏫 Người cố vấn": [
//     { id: '6', name: 'Hoàng Gia Bảo', email: 'bao.hoang@tuvanpro.vn', phone: '0967123456', address: 'TP. HCM' },
//     { id: '7', name: 'Lý Mỹ Duyên', email: 'duyen.ly@hotro24h.vn', phone: '0948987654', address: 'Huế' },
//     { id: '8', name: 'Tống Quốc Khánh', email: 'khanh.tong@supportnow.vn', phone: '0932145876', address: 'TP. HCM' },
//     { id: '9', name: 'Đoàn Thanh Tâm', email: 'tam.doan@tvchuyennghiep.vn', phone: '0978456211', address: 'Cần Thơ' },
//     { id: '10', name: 'Phạm Vĩnh Khang', email: 'khang.pham@tuvannganh.vn', phone: '0909654781', address: 'Hà Nội' },
//     { id: '11', name: 'Ngô Thị Hồng Nhung', email: 'nhung.ngo@hottuvan.vn', phone: '0921347856', address: 'Nghệ An' },
//     { id: '12', name: 'Bùi Minh Quân', email: 'quan.bui@hoptac247.vn', phone: '0933214433', address: 'TP. HCM' }
//   ],

//   "🛠️ Kỹ thuật viên hỗ trợ": [
//     { id: '13', name: 'Trần Minh Tâm', email: 'tam.tran@kythuat.vn', phone: '0902384671', address: 'Bình Dương' },
//     { id: '14', name: 'Nguyễn Quốc Dũng', email: 'dung.nguyen@support.vn', phone: '0913346782', address: 'TP. HCM' },
//     { id: '15', name: 'Lê Hoàng Thịnh', email: 'thinh.le@kythuatso.vn', phone: '0922345678', address: 'Đồng Nai' },
//     { id: '16', name: 'Phạm Anh Khoa', email: 'khoa.pham@support24.vn', phone: '0933456789', address: 'Cần Thơ' },
//     { id: '17', name: 'Võ Văn Đạt', email: 'dat.vo@helpline.vn', phone: '0987123456', address: 'TP. HCM' }
//   ],

//   "📢 Chuyên viên tư vấn sự cố": [
//     { id: '18', name: 'Nguyễn Thị Mỹ Linh', email: 'linh.nguyen@media.vn', phone: '0961122334', address: 'Hà Nội' },
//     { id: '19', name: 'Lê Văn Hùng', email: 'hung.le@truyenthong.vn', phone: '0979988776', address: 'Huế' },
//     { id: '20', name: 'Đỗ Thị Kim Ngân', email: 'ngan.do@prteam.vn', phone: '0932114455', address: 'TP. HCM' },
//     { id: '21', name: 'Trịnh Gia Huy', email: 'huy.trinh@mediahub.vn', phone: '0955556677', address: 'Đà Lạt' },
//     { id: '22', name: 'Vũ Ngọc Trâm', email: 'tram.vu@comms.vn', phone: '0944332211', address: 'Hải Phòng' }
//   ],
// };


// export default function DanhbaScreen() {
//   const [searchText, setSearchText] = useState('');

//   // // 🟢 Gửi dữ liệu lên Firebase khi mở màn hình
//   // useEffect(() => {
//   //   Object.entries(data).forEach(([group, people]) => {
//   //     people.forEach(person => {
//   //       const personRef = ref(database, `cuoc_goi_chuyen_gia/${person.id}`);
//   //       set(personRef, { ...person, group });
//   //     });
//   //   });
//   // }, []);

//   const handleEmailPress = (email) => {
//     Linking.openURL(`mailto:${email}`);
//   };

//   const handlePhonePress = (phone) => {
//     Linking.openURL(`tel:${phone}`);
//   };

//   const showPersonDetail = (person) => {
//     Alert.alert(
//       person.name,
//       `✉️ Email: ${person.email}\n📞 Điện thoại: ${person.phone}`,
//       [
//         { text: 'Đóng', style: 'cancel' },
//         { text: 'Gửi Email', onPress: () => handleEmailPress(person.email) },
//         { text: 'Gọi Điện', onPress: () => handlePhonePress(person.phone) }
//       ],
//       { cancelable: true }
//     );
//   };

//   const filteredData = Object.entries(data).reduce((acc, [group, people]) => {
//     const filteredPeople = people.filter(p =>
//       p.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//     if (filteredPeople.length > 0) acc[group] = filteredPeople;
//     return acc;
//   }, {});

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       <Text style={styles.header}>📇 Danh bạ liên hệ</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Tìm kiếm theo tên..."
//         value={searchText}
//         onChangeText={setSearchText}
//       />

//       {Object.keys(filteredData).map(group => (
//         <View key={group} style={styles.groupContainer}>
//           <Text style={styles.groupTitle}>{group}</Text>

//           {filteredData[group].map(person => (
//             <TouchableOpacity
//               key={person.id}
//               style={styles.personItem}
//               activeOpacity={0.8}
//               onPress={() => showPersonDetail(person)}
//             >
//               <View style={styles.iconWrap}>
//                 <Ionicons name="person-circle" size={40} color="#3498db" />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.personName}>{person.name}</Text>
//                 <Text style={styles.detailText}>📧 {person.email}</Text>
//                 <Text style={styles.detailText}>📞 {person.phone}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f8fb',
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 15,
//     color: '#2c3e50',
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 20,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#dcdcdc',
//   },
//   groupContainer: {
//     marginBottom: 30,
//   },
//   groupTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a5276',
//     marginBottom: 12,
//     paddingBottom: 6,
//     borderBottomWidth: 1.5,
//     borderColor: '#85c1e9',
//   },
//   personItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   iconWrap: {
//     marginRight: 12,
//   },
//   personName: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#2e86de',
//   },
//   detailText: {
//     fontSize: 13,
//     color: '#555',
//     marginTop: 2,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function DanhbaScreen() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    const dbRef = ref(database, 'cuoc_goi_chuyen_gia');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const grouped = {};

        // Group theo key `group` (đã lưu từ trước)
        Object.values(rawData).forEach((person) => {
          const group = person.group || 'Khác';
          if (!grouped[group]) grouped[group] = [];
          grouped[group].push(person);
        });

        setData(grouped);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const showPersonDetail = (person) => {
    Alert.alert(
      person.name,
      `✉️ Email: ${person.email}\n📞 Điện thoại: ${person.phone}`,
      [
        { text: 'Đóng', style: 'cancel' },
        { text: 'Gửi Email', onPress: () => handleEmailPress(person.email) },
        { text: 'Gọi Điện', onPress: () => handlePhonePress(person.phone) }
      ],
      { cancelable: true }
    );
  };

  const filteredData = Object.entries(data).reduce((acc, [group, people]) => {
    const filteredPeople = people.filter(p =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filteredPeople.length > 0) acc[group] = filteredPeople;
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>📇 Danh bạ hỗ trợ</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm theo tên..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {Object.keys(filteredData).map(group => (
        <View key={group} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group}</Text>

          {filteredData[group].map(person => (
            <TouchableOpacity
              key={person.id}
              style={styles.personItem}
              activeOpacity={0.8}
              onPress={() => showPersonDetail(person)}
            >
              <View style={styles.iconWrap}>
                <Ionicons name="person-circle" size={40} color="#3498db" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.detailText}>📧 {person.email}</Text>
                <Text style={styles.detailText}>📞 {person.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  groupContainer: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a5276',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderColor: '#85c1e9',
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrap: {
    marginRight: 12,
  },
  personName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2e86de',
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});
