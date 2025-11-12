import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 15,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    letterSpacing: 0.3,
    flex: 1,
    fontFamily: "System",
  },
})

export default styles
