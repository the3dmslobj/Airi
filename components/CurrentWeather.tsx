import currentBg from "@/assets/images/current-bg.png";
import sunny from "@/assets/images/icon-sunny.webp";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

const CurrentWeather = () => {
  return (
    <View className="flex flex-col gap-8">
      <ImageBackground
        source={currentBg}
        resizeMode="stretch"
        className="py-16 flex flex-col items-center gap-4 w-full"
      >
        <Text className="text-4xl font-dmBold text-n0">Berlin, Germany</Text>
        <Text className="text-2xl font-dm text-n200">Tuesday, Aug 5, 2025</Text>
        <View className="flex flex-row gap-5 items-center">
          <Image source={sunny} className="w-40 h-40" />
          <Text className="text-9xl font-dmSemiBoldItalic pt-10 pr-1 text-n0">{`30\u00B0`}</Text>
        </View>
      </ImageBackground>

      <View className="flex flex-col gap-7 flex-wrap">
        <View className="flex flex-row gap-7">
          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
            <Text className="text-n0 text-4xl font-dmLight">{`18\u00B0`}</Text>
          </View>

          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Humidity</Text>
            <Text className="text-n0 text-4xl font-dmLight">46%</Text>
          </View>
        </View>

        <View className="flex flex-row gap-7">
          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
            <Text className="text-n0 text-4xl font-dmLight">{`18\u00B0`}</Text>
          </View>

          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Humidity</Text>
            <Text className="text-n0 text-4xl font-dmLight">46%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
