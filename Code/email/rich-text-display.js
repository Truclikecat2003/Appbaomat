import { View, Text, StyleSheet } from "react-native"

export const RichTextDisplay = ({ content, formatting }) => {
  if (!formatting || Object.keys(formatting).length === 0) {
    return <Text style={styles.plainText}>{content}</Text>
  }

  const parts = []
  let lastIndex = 0

  const sortedFormats = Object.entries(formatting).sort(([rangeA], [rangeB]) => {
    const [startA] = rangeA.split("-").map(Number)
    const [startB] = rangeB.split("-").map(Number)
    return startA - startB
  })

  sortedFormats.forEach(([range, styles]) => {
    const [start, end] = range.split("-").map(Number)
    if (start >= lastIndex) {
      if (start > lastIndex) {
        parts.push({
          text: content.slice(lastIndex, start),
          styles: {},
          key: `${lastIndex}-plain`,
        })
      }
      parts.push({
        text: content.slice(start, end),
        styles: styles,
        key: range,
      })
      lastIndex = end
    }
  })

  if (lastIndex < content.length) {
    parts.push({
      text: content.slice(lastIndex),
      styles: {},
      key: `${lastIndex}-end`,
    })
  }

  return (
    <View style={styles.container}>
      {parts.map((part) => (
        <Text
          key={part.key}
          style={[
            styles.baseText,
            part.styles.bold && styles.bold,
            part.styles.italic && styles.italic,
            part.styles.underline && styles.underline,
            part.styles.color && { color: part.styles.color },
          ]}
        >
          {part.text}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  baseText: {
    color: "#e0f2fe",
    fontSize: 14,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#FFD700",
  },
  italic: {
    fontStyle: "italic",
    color: "#87CEEB",
  },
  underline: {
    textDecorationLine: "underline",
    color: "#FF69B4",
  },
  plainText: {
    color: "#e0f2fe",
    fontSize: 14,
    lineHeight: 22,
  },
})
