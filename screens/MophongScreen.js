import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView,
} from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, push } from 'firebase/database';

const MophongScreen = () => {
  const [dataList, setDataList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const moiPhongRef = ref(database, 'MoiPhongLuaDao');
    const unsubscribe = onValue(moiPhongRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data)
          .map(item => ({
            ...item,
            id: item.idCauHoi || '',
          }))
          .sort((a, b) => parseInt(a.stt) - parseInt(b.stt));
        setDataList(arr);
      } else {
        setDataList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const currentItem = dataList[currentIndex];

  const handleAnswer = (answer) => {
    console.log('User chọn:', answer);
    setUserAnswer(answer);
  };

  const handleNext = () => {
    if (!currentItem) return;

    setAnswers(prev => [
      ...prev,
      {
        idCauHoi: currentItem.id,
        stt: currentItem.stt,
        userAnswer,
        ketQuaDung: currentItem.ketQuaTraLoi,
        timestamp: Date.now()
      }
    ]);

    if (currentIndex < dataList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer(null);
    }
  };

  const handleSaveResult = async () => {
  const ketQuaRef = ref(database, 'Ketqua');
  const lanMoPhong = `lan_${Date.now()}`;
  await push(ketQuaRef, {
    lanMoPhong,
    thoiGian: new Date().toISOString(),
    danhSachCauTraLoi: answers,
  });
  alert('Đã lưu kết quả mô phỏng!');
};


  return (
    <SafeAreaView style={styles.container}>
      {currentItem ? (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Câu {currentItem.stt}</Text>

            <Text style={styles.label}>Email gửi:</Text>
            <Text style={styles.text}>{currentItem.emailGui}</Text>

            <Text style={styles.label}>Nội dung email:</Text>
            <Text style={styles.text}>{currentItem.noiDungEmail || '...'}</Text>

            {!userAnswer && (
              <View style={styles.optionsContainer}>
                <Text style={styles.label}>Bạn cho rằng đây là:</Text>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleAnswer('Email lừa đảo')}
                >
                  <Text style={styles.optionText}>Email lừa đảo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleAnswer('Email bình thường')}
                >
                  <Text style={styles.optionText}>Email bình thường</Text>
                </TouchableOpacity>
              </View>
            )}

            {userAnswer && (
              <>
                <Text style={styles.label}>Kết quả bạn chọn:</Text>
                <Text style={styles.text}>{userAnswer}</Text>

                <Text style={styles.label}>Kết quả đúng:</Text>
                <Text style={styles.text}>{currentItem.ketQuaTraLoi}</Text>

                <Text style={styles.label}>Cách phòng tránh:</Text>
                <Text style={styles.text}>{currentItem.cachPhongTranh || '...'}</Text>
              </>
            )}
          </ScrollView>

          {userAnswer && (
            <View style={styles.buttonContainer}>
              {currentIndex < dataList.length - 1 ? (
                <TouchableOpacity style={[styles.button, { backgroundColor: '#007bff' }]} onPress={handleNext}>
                  <Text style={styles.buttonText}>Tiếp</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={handleSaveResult}>
                  <Text style={styles.buttonText}>Lưu kết quả</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      ) : (
        <Text style={{ fontStyle: 'italic', color: '#666' }}>Đang tải mô phỏng...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 80, // để không bị nút che nội dung cuối
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  optionsContainer: {
    marginTop: 12,
  },
  optionButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  optionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  button: {
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MophongScreen;
