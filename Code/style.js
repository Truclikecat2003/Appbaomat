import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  
  buttonContainer: {
    flexDirection: 'row', // Các nút nằm ngang
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center', // Căn giữa văn bản
  },
  title: {
    fontSize: 24, // Kích thước lớn hơn
    fontWeight: 'bold', // In đậm
    color: 'red', // Màu đỏ
  },
  italicText: {
    fontStyle: 'italic', // In nghiêng
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1, // Độ dày của đường kẻ ngang
    borderBottomColor: '#333', // Màu của đường kẻ
    width: '100%', // Chiều dài của đường kẻ
  },
  warningBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFF3CD', // Màu vàng nhạt để tạo cảnh báo
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107', // Viền màu cam
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F', // Màu đỏ cảnh báo
    textAlign: 'center',
  },
  gioithieu: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
  },
  trainingButton: {
    marginTop: 10,
    backgroundColor: '#FF5733', // Màu cam đỏ nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  //t2
  trainingButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  securityBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E3F2FD', // Màu xanh nhạt làm nền
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1565C0', // Viền xanh đậm
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1', // Màu xanh đậm cho tiêu đề
    textAlign: 'center',
  },

  securityButton: {
    marginTop: 10,
    backgroundColor: '#1E88E5', // Màu xanh nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  securityButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  malwareBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFEBEE', // Màu đỏ nhạt cảnh báo
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D50000', // Viền đỏ đậm
  },
  malwareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C', // Màu đỏ đậm cho tiêu đề
    textAlign: 'center',
  },

  malwareButton: {
    marginTop: 10,
    backgroundColor: '#C62828', // Màu đỏ nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  malwareButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  socialEngineeringBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E8EAF6', // Màu xanh tím nhạt làm nền
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F51B5', // Viền xanh tím đậm
  },
  socialEngineeringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E', // Màu xanh tím đậm cho tiêu đề
    textAlign: 'center',
  },

  socialEngineeringButton: {
    marginTop: 10,
    backgroundColor: '#5C6BC0', // Màu xanh tím nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  socialEngineeringButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chung:{
    color: 'gray',
    fontStyle: 'italic',

  },
  //Ransomware
  ransomwareBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FAFAD2', // Màu vàng nhạt
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '	#FFFF00', // Viền vàng tươi
  },
  ransomwareTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB700', // Màu vàng cho tiêu đề
    textAlign: 'center',
  },
 
  ransomwareButton: {
    marginTop: 10,
    backgroundColor: '#FFD700', // Màu vàng nghệ nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  ransomwareButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // ung pho xam nhap
  intrusionBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#D1C4E9', // Màu tím nhạt 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4527A0', // Viền tím đậm
  },
  intrusionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#311B92', // Màu tím đậm cho tiêu đề
    textAlign: 'center',
  },
  
  intrusionButton: {
    marginTop: 10,
    backgroundColor: '#6A1B9A', // Màu tím nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  intrusionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dashboardBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E0F7FA', // Màu xanh nhạt
    borderRadius: 12, //Độ cong của viền
    borderWidth: 1,
    borderColor: '#00796B', // Viền xanh đậm
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40', // Xanh đậm cho tiêu đề
    textAlign: 'center',
  },
  dashboardSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dashboardItem: {
    width: '30%',
    alignItems: 'center',
  },
  dashboardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00796B',
  },
  dashboardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004D40',
    marginTop: 5,
  },
  dashboardSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004D40',
    marginTop: 15,
  },
  dashboardActivity: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#B2DFDB', // Xanh nhạt hơn
    borderRadius: 6,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004D40',
  },
  activityStatus: {
    fontSize: 12,
    color: '#333',
  },
  dashboardButton: {
    marginTop: 15,
    backgroundColor: '#00796B', // Xanh đậm nổi bật
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  dashboardButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  educationBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5F5F5', // Màu xám nhạt trung tính
    borderWidth: 1,
    
    borderColor: '#616161', // Viền xám đậm
  },
  educationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'justify',
    
    color: '#424242', // Màu xám đậm cho tiêu đề
    textAlign: 'center',
  },
  educationDescription: {
    fontSize: 8,
    color: '#333',
    textAlign: 'justify',
    fontStyle: 'italic',
    marginTop: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Làm avatar tròn
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Căn giữa menu và avatar
    width: '100%',
    padding: 10,
    backgroundColor: '#E0F7FA',
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: 250 },
  modalButton: { padding: 12, alignItems: 'flex-start' }, // Căn chữ sang trái
  modalText: { fontSize: 16, textAlign: 'left' }, // Đảm bảo chữ hiển thị đúng
  loginButton: {
    padding: 5,
    backgroundColor: "#E0F7FA",
    borderRadius: 5,
    marginLeft: 10, // Căn chỉnh bên phải avatar
    marginRight:-10,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

});export default styles;