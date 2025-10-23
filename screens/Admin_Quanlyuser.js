import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, onValue, set, push, update } from 'firebase/database';

const Admin_Quanlyuser = () => {
  const [users, setUsers] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });

  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, snapshot => {
      if (snapshot.exists()) {
        setUsers(snapshot.val());
      } else {
        setUsers({});
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddUser = () => {
    if (!formData.username || !formData.email || !formData.role) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newUserRef = push(ref(database, 'users'));
    set(newUserRef, formData)
      .then(() => {
        Alert.alert('Thành công', 'Đã thêm user mới');
        setFormData({ username: '', email: '', role: '' });
      })
      .catch(() => Alert.alert('Lỗi', 'Không thể thêm user'));
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setFormData(users[userId]);
  };

  const handleSaveUser = () => {
    if (!formData.username || !formData.email || !formData.role) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    const userRef = ref(database, `users/${editingUserId}`);
    update(userRef, formData)
      .then(() => {
        Alert.alert('Thành công', 'Đã lưu thông tin user');
        setEditingUserId(null);
        setFormData({ username: '', email: '', role: '' });
      })
      .catch(() => Alert.alert('Lỗi', 'Không thể lưu user'));
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({ username: '', email: '', role: '' });
  };

  const renderUserItem = ({ item, index }) => {
    const userId = Object.keys(users)[index];
    const user = item;

    if (editingUserId === userId) {
      return (
        <View style={[styles.userRow, styles.editRow]}>
          <TextInput
            style={[styles.input, styles.textSmall]}
            value={formData.username}
            placeholder="Username"
            onChangeText={text => handleChange('username', text)}
          />
          <TextInput
            style={[styles.input, styles.textLarge]}
            value={formData.email}
            placeholder="Email"
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, styles.textSmall]}
            value={formData.role}
            placeholder="Role"
            onChangeText={text => handleChange('role', text)}
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveUser}>
              <Text style={styles.buttonText}>💾 Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit}>
              <Text style={styles.buttonText}>❌ Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.userRow}>
        <Text style={[styles.userText, styles.textSmall]}>{user.username}</Text>
        <Text style={[styles.userText, styles.textLarge]}>{user.email}</Text>
        <Text style={[styles.userText, styles.textSmall]}>{user.role}</Text>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditUser(userId)}>
          <Text style={styles.buttonText}>✏️ Sửa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={styles.title}>Quản Lý User</Text>

      {editingUserId === null && (
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username}
              onChangeText={text => handleChange('username', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Role</Text>
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={formData.role}
              onChangeText={text => handleChange('role', text)}
            />
          </View>

          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddUser}>
            <Text style={styles.buttonText}>➕ Thêm User</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={[styles.headerText, styles.textSmall]}>Username</Text>
        <Text style={[styles.headerText, styles.textLarge]}>Email</Text>
        <Text style={[styles.headerText, styles.textSmall]}>Role</Text>
        <Text style={[styles.headerText, { width: 60 }]}></Text>
      </View>

      <FlatList
        data={Object.values(users)}
        keyExtractor={(item, index) => Object.keys(users)[index]}
        renderItem={renderUserItem}
        style={{ marginTop: 10 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có user nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fdfdfd',
    fontSize: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#3498db',
  },
  editButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#ecf0f1',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#34495e',
    fontSize: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  editRow: {
    backgroundColor: '#e8f4fd',
  },
  userText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  textSmall: {
    flex: 1,
    maxWidth: 110,
  },
  textLarge: {
    flex: 2,
    maxWidth: 200,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Admin_Quanlyuser;
