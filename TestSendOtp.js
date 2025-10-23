import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function TestSendOtp() {
  useEffect(() => {
    fetch('http://192.168.1.8:3000/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'abc@example.com' }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Phản hồi:', data);
      })
      .catch(err => {
        console.error('❌ Lỗi:', err);
      });
  }, []);

  return (
    <View>
      <Text>Đang gửi OTP...</Text>
    </View>
  );
}
