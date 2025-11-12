import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Svg, { Line, Circle, G, Text as SvgText } from "react-native-svg"

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

const LineChart = ({ data, startDate, endDate, trendDates }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyChartContainer}>
        <Icon name="chart-line" size={40} color="#64748b" />
        <Text style={styles.emptyText}>Chưa có phân tích</Text>
      </View>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value || 0)) + 10
  const minValue = 0
  const range = maxValue - minValue

  const chartWidth = 500
  const chartHeight = 280
  const svgWidth = 600
  const svgHeight = 450
  const padding = 80

  const points = data.map((item, index) => {
    const x = (index / Math.max(1, data.length - 1)) * chartWidth
    const y = chartHeight - ((item.value - minValue) / range) * chartHeight
    return { x: x + padding, y: y + 100, value: Math.round(item.value) }
  })

  const segmentTrends = points.map((point, index) => {
    if (index === 0) return null // First point has no previous segment
    const prevValue = data[index - 1].value
    const currValue = data[index].value

    if (currValue > prevValue) return "up" // Tăng -> đỏ
    if (currValue < prevValue) return "down" // Giảm -> xanh
    return "stable" // Ổn định -> cyan
  })

  const lastValue = data[data.length - 1].value
  const secondLastValue = data.length > 1 ? data[data.length - 2].value : lastValue
  let trendColor = "#06b6d4" // neutral (no change)
  let trendType = "Ổn định"

  if (lastValue > secondLastValue) {
    trendColor = "#ef4444"
    trendType = "Tăng"
  } else if (lastValue < secondLastValue) {
    trendColor = "#10b981"
    trendType = "Giảm"
  }

  const getSegmentColor = (trend) => {
    if (trend === "up") return "#ef4444" // Tăng -> đỏ
    if (trend === "down") return "#10b981" // Giảm -> xanh
    return "#06b6d4" // Ổn định -> cyan
  }

  return (
    <View>
      <View style={styles.lineChartWrapper}>
        <Text style={styles.chartLabel}>Số lượng lừa đảo phát hiện</Text>
        <View style={styles.chartArea}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={styles.svg}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, i) => (
              <Line
                key={`grid-${i}`}
                x1={padding}
                y1={100 + (y / 100) * chartHeight}
                x2={padding + chartWidth}
                y2={100 + (y / 100) * chartHeight}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((y, i) => {
              const value = Math.round(maxValue - (y / 100) * maxValue)
              return (
                <SvgText
                  key={`y-label-${i}`}
                  x="40"
                  y={105 + (y / 100) * chartHeight}
                  fontSize="13"
                  fill="#94a3b8"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {formatNumber(value)}
                </SvgText>
              )
            })}

            {/* Left vertical line */}
            <Line
              x1={points[0].x - 30}
              y1="70"
              x2={points[0].x - 30}
              y2={100 + chartHeight}
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Right vertical line */}
            <Line
              x1={points[points.length - 1].x + 30}
              y1="70"
              x2={points[points.length - 1].x + 30}
              y2={100 + chartHeight}
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Bottom horizontal line */}
            <Line
              x1={points[0].x - 30}
              y1={100 + chartHeight}
              x2={points[points.length - 1].x + 30}
              y2={100 + chartHeight}
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Line segments with color based on trend */}
            {points.map((point, index) => {
              if (index === 0) return null
              const prevPoint = points[index - 1]
              const segmentColor = getSegmentColor(segmentTrends[index])
              return (
                <Line
                  key={`segment-${index}`}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke={segmentColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              )
            })}

            {/* Data points and labels */}
            {points.map((point, index) => (
              <G key={`dot-${index}`}>
                <Circle cx={point.x} cy={point.y} r="7" fill="#06b6d4" opacity="0.8" />
                <Circle cx={point.x} cy={point.y} r="4" fill="#06b6d4" />
                <SvgText
                  x={point.x}
                  y={point.y - 50}
                  fontSize="16"
                  fontWeight="700"
                  fill="#06b6d4"
                  textAnchor="middle"
                  fontFamily="System"
                >
                  {formatNumber(point.value)}
                </SvgText>
              </G>
            ))}
          </Svg>
        </View>

        {/* Legend and trend indicator */}
        <View style={styles.trendLegend}>
          <View style={styles.legendItemGroup}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.legendText}>Tăng</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#10b981" }]} />
              <Text style={styles.legendText}>Giảm</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#06b6d4" }]} />
              <Text style={styles.legendText}>Ổn định</Text>
            </View>
          </View>
          <View style={[styles.trendBadge, { backgroundColor: trendColor + "20", borderColor: trendColor }]}>
            <View style={[styles.trendDot, { backgroundColor: trendColor }]} />
            <Text style={[styles.trendBadgeText, { color: trendColor }]}>Xu hướng {trendType}</Text>
          </View>
        </View>

        {/* Date labels */}
        <View style={styles.xAxisDateLabels}>
          <Text style={styles.xAxisDate}>{startDate}</Text>
          <Text style={styles.xAxisDate}>{endDate}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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

export default LineChart
