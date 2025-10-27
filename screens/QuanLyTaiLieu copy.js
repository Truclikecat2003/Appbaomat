import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Alert,
  Linking,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { useRoute } from "@react-navigation/native";
import { app } from "../firebaseConfig";

const { height } = Dimensions.get("window");

export default function QuanLyTaiLieuScreen() {
  const route = useRoute();
  const username = route.params?.userData?.username ?? "unknown";

  const [taiLieu, setTaiLieu] = useState([]);
  const [taiLieuLoc, setTaiLieuLoc] = useState([]);
  const [loaiLoc, setLoaiLoc] = useState("tatca");
  const [showFilter, setShowFilter] = useState(false);
  const cacheTaiLieu = useRef([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tenTaiLieu, setTenTaiLieu] = useState("");
  const [linkTaiLieu, setLinkTaiLieu] = useState("");
  const [loaiTaiLieu, setLoaiTaiLieu] = useState("web");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ⚙️ Thêm cho chỉnh sửa
  const [dangSua, setDangSua] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);

  const db = getDatabase(app);

  // 🌧 Matrix effect
  const rainAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rainAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(rainAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = rainAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height],
  });

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*".split("");
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    const cols = 25;
    const rows = 50;
    const data = Array.from({ length: cols }, (_, i) =>
      Array.from({ length: rows }, (_, j) => ({
        id: `col-${i}-row-${j}`,
        char: chars[Math.floor(Math.random() * chars.length)],
      }))
    );
    setMatrix(data);

    const interval = setInterval(() => {
      setMatrix((prev) =>
        prev.map((col) =>
          col.map((cell) => ({
            ...cell,
            char: chars[Math.floor(Math.random() * chars.length)],
          }))
        )
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 📦 Lấy dữ liệu Firebase
  useEffect(() => {
    let isMounted = true;
    const taiLieuRef = ref(db, "tailieu");

    const unsubscribe = onValue(taiLieuRef, (snapshot) => {
      if (!isMounted) return;
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        cacheTaiLieu.current = arr;
        setTaiLieu(arr);
        setTaiLieuLoc(arr);
      } else {
        cacheTaiLieu.current = [];
        setTaiLieu([]);
        setTaiLieuLoc([]);
      }
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const normalizeLink = (url) =>
    url.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

  // ➕ Thêm tài liệu
  const themTaiLieu = async () => {
    if (loading) return;
    setLoading(true);

    if (!tenTaiLieu.trim() || !linkTaiLieu.trim()) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập đầy đủ tên và link tài liệu!");
      setLoading(false);
      return;
    }

    const newLink = normalizeLink(linkTaiLieu);
    const ds = cacheTaiLieu.current;

    if (ds.some((i) => i.tentailieu.trim().toLowerCase() === tenTaiLieu.trim().toLowerCase())) {
      Alert.alert("❌ Trùng tên", "Tên tài liệu này đã tồn tại!");
      setLoading(false);
      return;
    }
    if (ds.some((i) => normalizeLink(i.link) === newLink)) {
      Alert.alert("❌ Trùng link", "Link này đã có trong hệ thống!");
      setLoading(false);
      return;
    }

    const newRef = push(ref(db, "tailieu"));
    const id = newRef.key;
    const ngayTao = new Date().toLocaleDateString("vi-VN");
    const duLieuMoi = {
      Idtailieu: id,
      tentailieu: tenTaiLieu.trim(),
      loai: loaiTaiLieu.toUpperCase(),
      link: linkTaiLieu.trim(),
      ngaytao: ngayTao,
      nguoitao: username,
    };

    try {
      await set(newRef, duLieuMoi);
      cacheTaiLieu.current.unshift(duLieuMoi);
      setTaiLieuLoc([duLieuMoi, ...taiLieuLoc]);
      InteractionManager.runAfterInteractions(() => {
        setModalVisible(false);
        setTenTaiLieu("");
        setLinkTaiLieu("");
        setLoaiTaiLieu("web");
      });
    } catch (err) {
      Alert.alert("❌ Lỗi ghi Firebase", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Sửa tài liệu
  const suaTaiLieu = async () => {
    if (loading) return;
    setLoading(true);

    if (!tenTaiLieu.trim() || !linkTaiLieu.trim()) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập đầy đủ tên và link!");
      setLoading(false);
      return;
    }

    try {
      const capNhatRef = ref(db, "tailieu/" + idDangSua);
      const ngaySua = new Date().toLocaleDateString("vi-VN");
      const duLieuSua = {
        tentailieu: tenTaiLieu.trim(),
        loai: loaiTaiLieu.toUpperCase(),
        link: linkTaiLieu.trim(),
        ngaytao: ngaySua,
        nguoitao: username,
      };

      await set(capNhatRef, duLieuSua);
      Alert.alert("✅ Thành công", "Đã cập nhật tài liệu!");
      InteractionManager.runAfterInteractions(() => {
        setModalVisible(false);
        setDangSua(false);
        setIdDangSua(null);
        setTenTaiLieu("");
        setLinkTaiLieu("");
        setLoaiTaiLieu("web");
      });
    } catch (err) {
      Alert.alert("❌ Lỗi cập nhật", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Xóa tài liệu
  const xoaTaiLieu = async (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa tài liệu này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => await remove(ref(db, "tailieu/" + id)),
      },
    ]);
  };

  const locTheoLoai = (loai) => {
    setLoaiLoc(loai);
    setShowFilter(false);
    if (loai === "tatca") {
      setTaiLieuLoc(cacheTaiLieu.current);
    } else {
      const loc = cacheTaiLieu.current.filter(
        (item) => item.loai.toLowerCase() === loai.toLowerCase()
      );
      setTaiLieuLoc(loc);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="file-lock-outline" color="#00FFAA" size={24} />
          <Text style={styles.cardTitle}>{item.tentailieu}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (!item.link?.startsWith("http")) {
              Alert.alert("⚠️ Link không hợp lệ", item.link || "Không có link");
              return;
            }
            Linking.openURL(item.link);
          }}
        >
          <Text style={styles.cardLink}>{item.link}</Text>
        </TouchableOpacity>
        <Text style={styles.metaText}>
          🧑‍💻 {item.nguoitao} | 📅 {item.ngaytao}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* 🖋 Cây bút sửa */}
        <TouchableOpacity
          onPress={() => {
            setDangSua(true);
            setIdDangSua(item.id);
            setTenTaiLieu(item.tentailieu);
            setLinkTaiLieu(item.link);
            setLoaiTaiLieu(item.loai);
            setModalVisible(true);
          }}
        >
          <Icon name="pencil-outline" color="#00FFAA" size={24} style={{ marginRight: 8 }} />
        </TouchableOpacity>

        <Text style={styles.cardType}>{item.loai}</Text>
        <TouchableOpacity onPress={() => xoaTaiLieu(item.id)}>
          <Icon name="delete-outline" color="#ff4444" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Animated.View style={[styles.matrixLayer, { transform: [{ translateY }] }]}>
        <View style={styles.matrixColumns}>
          {matrix.map((col, i) => (
            <View key={`col-${i}`}>
              {col.map((cell) => (
                <Text key={cell.id} style={styles.matrixCode}>
                  {cell.char}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Animated.View>

      <LinearGradient
        colors={["rgba(0,0,0,0.9)", "rgba(0,40,20,0.95)"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
          <Icon name="filter-variant" size={28} color="#00FFAA" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          🧠 Tài Liệu ({loaiLoc === "tatca" ? "Tất cả" : loaiLoc.toUpperCase()})
        </Text>
        <TouchableOpacity onPress={() => { setDangSua(false); setModalVisible(true); }}>
          <Icon name="plus-circle-outline" size={28} color="#00FFAA" />
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.filterMenu}>
          {["tatca", "web", "video", "pdf", "app", "diễn đàn"].map((loai) => (
            <TouchableOpacity key={loai} onPress={() => locTheoLoai(loai)}>
              <Text style={styles.filterOption}>
                {loai === "tatca" ? "Tất cả" : loai.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!isReady ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#00FFAA" />
      ) : (
        <FlatList data={taiLieuLoc} renderItem={renderItem} keyExtractor={(item) => item.id} />
      )}

      {/* Modal thêm / sửa tài liệu */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {dangSua ? "Cập nhật tài liệu" : "Thêm tài liệu mới"}
            </Text>
            <TextInput
              placeholder="Tên tài liệu"
              placeholderTextColor="#888"
              style={styles.input}
              value={tenTaiLieu}
              onChangeText={setTenTaiLieu}
            />
            <TextInput
              placeholder="Link tài liệu (https://...)"
              placeholderTextColor="#888"
              style={styles.input}
              value={linkTaiLieu}
              onChangeText={setLinkTaiLieu}
            />
            <Picker selectedValue={loaiTaiLieu} onValueChange={setLoaiTaiLieu} style={styles.picker}>
              <Picker.Item label="Web" value="Web" />
              <Picker.Item label="Video" value="Video" />
              <Picker.Item label="PDF" value="PDF" />
              <Picker.Item label="App" value="App" />
              <Picker.Item label="Diễn đàn" value="Diễn đàn" />
            </Picker>
            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.6 }]}
              onPress={dangSua ? suaTaiLieu : themTaiLieu}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#003322" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {dangSua ? "Cập nhật" : "Lưu"}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  matrixLayer: { position: "absolute", width: "100%", height: "300%" },
  matrixColumns: { flexDirection: "row", justifyContent: "space-around" },
  matrixCode: { color: "#00FFAA", fontFamily: "monospace", fontSize: 13, lineHeight: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,30,20,0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#00FFAA55",
  },
  headerText: { color: "#00FFAA", fontWeight: "bold", fontSize: 18 },
  filterMenu: {
    backgroundColor: "rgba(0,50,30,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#00FFAA55",
    paddingVertical: 8,
  },
  filterOption: {
    color: "#00FFAA",
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0,50,30,0.6)",
    borderWidth: 1,
    borderColor: "#00FFAA77",
  },
  cardTitle: { color: "#fff", marginLeft: 8, flexShrink: 1 },
  cardLink: {
    color: "#00FFAA",
    marginLeft: 32,
    marginTop: 3,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  cardType: { color: "#00FFAA", marginRight: 10 },
  metaText: { color: "#aaa", fontSize: 11, marginLeft: 32, marginTop: 3 },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  modalBox: {
    width: "85%",
    backgroundColor: "rgba(0,40,30,0.95)",
    padding: 20,
    borderRadius: 12,
    borderColor: "#00FFAA55",
    borderWidth: 1,
  },
  modalTitle: { color: "#00FFAA", fontSize: 18, textAlign: "center", marginBottom: 10 },
  input: { backgroundColor: "#001A12", color: "#fff", borderRadius: 8, padding: 10, marginVertical: 5 },
  picker: { backgroundColor: "#001A12", color: "#00FFAA", marginVertical: 8 },
  saveButton: { backgroundColor: "#00FFAA", padding: 10, borderRadius: 8 },
  saveButtonText: { textAlign: "center", color: "#003322", fontWeight: "bold" },
  cancelText: { color: "#ff5555", textAlign: "center", marginTop: 10 },
});
