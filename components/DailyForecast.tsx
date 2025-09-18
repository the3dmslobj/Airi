import sunny from "@/assets/images/icon-sunny.webp";
import React from "react";
import { Image, Text, View } from "react-native";

const DailyForecast = () => {
  return (
    <View className="flex flex-col gap-5">
      <Text className="text-[22px] text-n0 font-dmSemiBold">
        Daily Forecast
      </Text>

      <View className="flex flex-row justify-between">
        <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
          <Text className="text-2xl font-md text-n0">Tue</Text>
          <Image source={sunny} className="w-20 h-20" />
          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
            <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
          </View>
        </View>

        <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
          <Text className="text-2xl font-md text-n0">Tue</Text>
          <Image source={sunny} className="w-20 h-20" />
          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
            <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
          </View>
        </View>

        <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
          <Text className="text-2xl font-md text-n0">Tue</Text>
          <Image source={sunny} className="w-20 h-20" />
          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
            <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DailyForecast;
