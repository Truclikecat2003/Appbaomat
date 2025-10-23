import { View } from "react-native"
import SplashScreenComponent from "../components/SplashScreen"

export default function SplashScreen({ navigation }) {
  const handleSplashFinish = () => {
    navigation.replace("LoginScreen")
  }

  return (
    <View style={{ flex: 1 }}>
      <SplashScreenComponent onFinish={handleSplashFinish} />
    </View>
  )
}
