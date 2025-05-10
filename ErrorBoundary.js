// ErrorBoundary.js
import React from 'react';
import { View, Text } from 'react-native';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log("Lỗi trong component:", error);
    console.log("Thông tin thêm:", info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red' }}>Lỗi xảy ra: {this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
