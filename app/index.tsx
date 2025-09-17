import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-n0">
      <View className="flex-1 items-center justify-center">
        <Text className="font-briBold text-3xl text-n900">Hello</Text>
        <Text className="mt-2 font-dmBold text-base text-n600">
          Welcome to Airi.
        </Text>
      </View>
    </SafeAreaView>
  );
}
