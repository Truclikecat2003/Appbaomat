import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const MoPhongLuaDaoScreen = () => {
  const [luaDao, setLuaDao] = useState(null);

  const handleChon = (chon) => {
    setLuaDao(chon);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💥 MÔ PHỎNG LỪA ĐẢO 📧</Text>
      <Text style={styles.subtitle}>Bạn hãy phân tích email dưới đây và chọn xem nó có phải lừa đảo không:</Text>

      <View style={styles.emailBox}>
        <Text style={styles.emailTitle}>📩 Gửi từ: <Text style={styles.emailSender}>support@abc123-bank-security.com</Text></Text>
        <Text style={styles.emailContent}>
          🔐 “Tài khoản của bạn sẽ bị <Text style={styles.danger}>khóa trong 24 giờ</Text>. Nhấn vào link bên dưới để xác minh ngay:{"\n"}
          🔗 http://secure-verify-your-bank-login.com”
        </Text>
      </View>

      <Text style={styles.question}>🧐 Theo bạn, email này có phải là lừa đảo?</Text>

      <View style={styles.choiceContainer}>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            luaDao === true && styles.choiceSelectedTrue,
          ]}
          onPress={() => handleChon(true)}
        >
          <FontAwesome name="bug" size={20} color={luaDao === true ? '#fff' : '#c0392b'} />
          <Text style={[styles.choiceText, luaDao === true && { color: '#fff' }]}> Lừa đảo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceButton,
            luaDao === false && styles.choiceSelectedFalse,
          ]}
          onPress={() => handleChon(false)}
        >
          <FontAwesome name="thumbs-up" size={20} color={luaDao === false ? '#fff' : '#1abc9c'} />
          <Text style={[styles.choiceText, luaDao === false && { color: '#fff' }]}> Không lừa đảo</Text>
        </TouchableOpacity>
      </View>

      {luaDao !== null && (
        <>
          <Text style={styles.feedback}>
            {luaDao
              ? '🎯 Chính xác! Đây là một email lừa đảo rõ ràng với địa chỉ đáng ngờ và nội dung gây hoang mang.'
              : '❌ Sai rồi. Email này là một chiêu trò lừa đảo điển hình – đừng bao giờ nhấn vào liên kết kiểu này!'}
          </Text>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>🚀 Tiếp tục học</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default MoPhongLuaDaoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#ffeaa7',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#e84393',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d3436',
    fontStyle: 'italic',
  },
  emailBox: {
    backgroundColor: '#fff0f6',
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: '#fd79a8',
    shadowColor: '#d63031',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emailTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
    color: '#d63031',
  },
  emailSender: {
    color: '#e67e22',
    fontStyle: 'italic',
  },
  emailContent: {
    fontSize: 15,
    color: '#2d3436',
    lineHeight: 22,
  },
  danger: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  question: {
    fontSize: 18,
    marginBottom: 14,
    fontWeight: '600',
    color: '#6c5ce7',
    textAlign: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: '#dfe6e9',
    borderWidth: 2,
    borderColor: '#b2bec3',
    shadowColor: '#636e72',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  choiceSelectedTrue: {
    backgroundColor: '#d63031',
    borderColor: '#c0392b',
  },
  choiceSelectedFalse: {
    backgroundColor: '#00b894',
    borderColor: '#019875',
  },
  choiceText: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d3436',
  },
  feedback: {
    fontSize: 16,
    marginBottom: 24,
    color: '#2d3436',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
