import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Footer from "./footer"
import LineChart from "./sodoxuhuong_email"

const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (num >= 1000) {
    const thousands = (num / 1000).toFixed(1)
    return thousands.replace(/\.0$/, "").replace(".", "k")
  }
  return num.toString()
}

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <View style={styles.chartContainer}>
      <View style={styles.barChartWrapper}>
        {data.map((item, index) => (
          <View key={index} style={styles.barColumn}>
            <Text style={styles.barValue}>{formatNumber(item.value)}</Text>
            <View style={styles.barLabelContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.value / maxValue) * 140,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.updateTime}>Cập nhật ngày 15/11/2024 lúc 14:30</Text>
    </View>
  )
}

const ThongKeVaCanhBao = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [timePeriod, setTimePeriod] = useState("5weeks")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [tempStartDate, setTempStartDate] = useState("")
  const [tempEndDate, setTempEndDate] = useState("")
  const [hasCustomDate, setHasCustomDate] = useState(false)
  const [showChooseDateForm, setShowChooseDateForm] = useState(false)

  const fraudData = [
    { label: "Ngân hàng", value: 85, color: "#3b82f6" },
    { label: "Từ thiện", value: 65, color: "#06b6d4" },
    { label: "Tính cảm", value: 48, color: "#10b981" },
    { label: "Trưởng thương", value: 35, color: "#8b5cf6" },
    { label: "Việc làm", value: 52, color: "#f59e0b" },
  ]

  const trendData5Weeks = [
    { value: 75, week: "Tuần 1" },
    { value: 82, week: "Tuần 2" },
    { value: 68, week: "Tuần 3" },
    { value: 290, week: "Tuần 4" },
    { value: 1245689, week: "Tuần 5" },
  ]

  const trendData4Weeks = [
    { value: 82, week: "Tuần 1" },
    { value: 68, week: "Tuần 2" },
    { value: 90, week: "Tuần 3" },
    { value: 78, week: "Tuần 4" },
  ]

  const getTrendData = () => {
    if (hasCustomDate) {
      return trendData5Weeks
    }
    if (timePeriod === "5weeks") return trendData5Weeks
    if (timePeriod === "4weeks") return trendData4Weeks
    return []
  }

  const handleApplyDateRange = () => {
    if (tempStartDate.trim() && tempEndDate.trim()) {
      setStartDate(tempStartDate)
      setEndDate(tempEndDate)
      setHasCustomDate(true)
      setTimePeriod("custom")
      setShowDatePicker(false)
    }
  }

  const getTimePeriodText = () => {
    if (timePeriod === "5weeks") return "5 tuần"
    if (timePeriod === "4weeks") return "4 tuần"
    if (timePeriod === "custom") return `${startDate} - ${endDate}`
    return "5 tuần"
  }

  const alerts = [
    {
      type: "danger",
      icon: "alert-circle",
      title: "Giả mạo trang web ngân hàng",
      description: "Một chiến dịch lừa đảo mới đang nhắm mục tiêu...",
    },
    {
      type: "warning",
      icon: "alert",
      title: 'Lừa đảo "việc làm tại nhà"',
      description: "Số lượng báo cáo tăng đột biến trong tuần qua.",
    },
  ]

  const calculateDateRange = () => {
    const today = new Date()
    let startDateObj, endDateObj

    if (timePeriod === "5weeks") {
      endDateObj = new Date(today)
      startDateObj = new Date(today)
      startDateObj.setDate(today.getDate() - 35)
    } else if (timePeriod === "4weeks") {
      endDateObj = new Date(today)
      startDateObj = new Date(today)
      startDateObj.setDate(today.getDate() - 28)
    } else if (timePeriod === "custom") {
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("/")
        return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      }
      try {
        startDateObj = parseDate(startDate)
        endDateObj = parseDate(endDate)
      } catch {
        startDateObj = new Date()
        endDateObj = new Date()
      }
    }

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    return {
      startFormatted: formatDate(startDateObj),
      endFormatted: formatDate(endDateObj),
    }
  }

  const dateRange = calculateDateRange()

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Icon name="chart-line" size={28} color="#8b5cf6" />
        <Text style={styles.headerTitle}>Thống kê & Cảnh báo</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Các loại lừa đảo phổ biến</Text>
            <View style={styles.periodDropdown}>
              <TouchableOpacity>
                <Text style={styles.periodText}>30 ngày qua</Text>
                <Icon name="chevron-down" size={16} color="#06b6d4" />
              </TouchableOpacity>
            </View>
          </View>
          <BarChart data={fraudData} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Xu hướng lừa đảo theo tuần</Text>
            <View style={styles.periodDropdown}>
              <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
                <Text style={styles.periodText}>{getTimePeriodText()}</Text>
                <Icon name="chevron-down" size={16} color="#06b6d4" />
              </TouchableOpacity>
            </View>
          </View>

          {hasCustomDate && (
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statNumber}>1,230</Text>
                <View style={styles.statChange}>
                  <Icon name="arrow-down" size={14} color="#ef4444" />
                  <Text style={styles.changeText}>-2.1%</Text>
                </View>
              </View>
            </View>
          )}

          <LineChart data={getTrendData()} startDate={dateRange.startFormatted} endDate={dateRange.endFormatted} />

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                style={styles.dateOption}
                onPress={() => {
                  setTimePeriod("5weeks")
                  setHasCustomDate(false)
                  setShowDatePicker(false)
                  setShowChooseDateForm(false)
                }}
              >
                <Text style={styles.dateOptionText}>5 tuần</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateOption}
                onPress={() => {
                  setTimePeriod("4weeks")
                  setHasCustomDate(false)
                  setShowDatePicker(false)
                  setShowChooseDateForm(false)
                }}
              >
                <Text style={styles.dateOptionText}>4 tuần</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateOption} onPress={() => setShowChooseDateForm(!showChooseDateForm)}>
                <Text style={styles.dateOptionText}>Chọn ngày</Text>
              </TouchableOpacity>

              {showChooseDateForm && (
                <View style={styles.dateInputSection}>
                  <Text style={styles.dateInputLabel}>Từ ngày:</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#64748b"
                    value={tempStartDate}
                    onChangeText={setTempStartDate}
                  />
                  <Text style={styles.dateInputLabel}>Đến ngày:</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#64748b"
                    value={tempEndDate}
                    onChangeText={setTempEndDate}
                  />
                  <TouchableOpacity style={styles.applyButton} onPress={handleApplyDateRange}>
                    <Text style={styles.applyButtonText}>Áp dụng</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cảnh báo mới</Text>
          {alerts.map((alert, index) => (
            <View
              key={index}
              style={[styles.alertItem, alert.type === "danger" ? styles.alertDanger : styles.alertWarning]}
            >
              <View
                style={[styles.alertIcon, alert.type === "danger" ? styles.alertIconDanger : styles.alertIconWarning]}
              >
                <Icon name={alert.icon} size={20} color={alert.type === "danger" ? "#dc2626" : "#d97706"} />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.description}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#94a3b8" />
            </View>
          ))}
        </View>
      </ScrollView>

      <Footer onNavPress={(id) => console.log("Navigated to:", id)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1c",
    flexDirection: "column",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#10b98120",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f0f9ff",
    letterSpacing: 0.3,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#10b98115",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f0f9ff",
    letterSpacing: 0.3,
  },
  periodDropdown: {
    backgroundColor: "#0a0f1c",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#10b98130",
  },
  periodText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
  },
  chartContainer: {
    justifyContent: "center",
    marginVertical: 8,
  },
  barChartWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
    marginBottom: 16,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#06b6d4",
    marginBottom: 8,
  },
  barLabelContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 150,
    marginBottom: 10,
  },
  bar: {
    width: "70%",
    borderRadius: 6,
    minWidth: 24,
  },
  barLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "500",
  },
  updateTime: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  lineChartWrapper: {
    marginVertical: 20,
  },
  chartLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartArea: {
    height: 450,
    backgroundColor: "#0a0f1c30",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  svg: {
    width: "100%",
    height: "100%",
  },
  xAxisDateLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 12,
  },
  xAxisDate: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f0f9ff",
    marginRight: 12,
  },
  statChange: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7f1d1d30",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  changeText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
  },
  alertDanger: {
    backgroundColor: "#7f1d1d20",
    borderColor: "#dc262640",
  },
  alertWarning: {
    backgroundColor: "#78350f20",
    borderColor: "#d9770640",
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  alertIconDanger: {
    backgroundColor: "#dc262630",
  },
  alertIconWarning: {
    backgroundColor: "#d9770630",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f0f9ff",
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 16,
  },
  datePickerContainer: {
    backgroundColor: "#0a0f1c",
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#10b98130",
    overflow: "hidden",
  },
  dateOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#10b98115",
  },
  dateOptionText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "500",
  },
  dateInputSection: {
    backgroundColor: "#1a202c",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#10b98115",
  },
  dateInputLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  dateInput: {
    backgroundColor: "#0a0f1c",
    borderWidth: 1,
    borderColor: "#10b98130",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f0f9ff",
    fontSize: 12,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 14,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyChartContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0f1c30",
    borderRadius: 8,
    marginVertical: 16,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "500",
  },
  trendLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0a0f1c30",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  legendItemGroup: {
    flexDirection: "row",
    gap: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "600",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 8,
  },
  trendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
})

export default ThongKeVaCanhBao
