import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";

const HourlyForecast = () => {
  const [isDayDropDownOpen, setIsDayDropDownOpen] = useState<boolean>(false);
  const daysOp = useRef(new Animated.Value(0)).current;

  Animated.timing(daysOp, {
    toValue: isDayDropDownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return (
    <View className="flex flex-col gap-4 px-4 py-5 bg-n800 rounded-xl">
      <View className="flex flex-row items-center justify-between w-full">
        <Text className="text-[22px] text-n0 font-dmSemiBold">
          Hourly Forecast
        </Text>

        <View className="relative">
          <TouchableOpacity
            className="flex flex-row px-4 gap-3 items-center bg-n600 py-2 rounded-lg"
            onPress={() => setIsDayDropDownOpen(!isDayDropDownOpen)}
          >
            <Text className="font-dm text-xl text-n0">Tuesday</Text>
            <Ionicons
              name={
                isDayDropDownOpen
                  ? `chevron-up-outline`
                  : `chevron-down-outline`
              }
              color={"white"}
              size={18}
            />
          </TouchableOpacity>

          <Animated.View
            className="bg-n800 border-[1px] border-n600 absolute top-14 flex flex-col gap-1 p-2 rounded-xl w-[180px] right-0"
            style={{ opacity: daysOp }}
          >
            <TouchableOpacity className="p-2.5 bg-n700 rounded-lg">
              <Text className="font-dm text-xl text-n0">Monday</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View className="flex flex-row gap-4">
        <View>
          <Text className="text-white">Hello</Text>
        </View>
      </View>
    </View>
  );
};

export default HourlyForecast;
