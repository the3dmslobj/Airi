import { DailyWeatherType } from "@/interfaces/weather.interface";
import { isoToWeekday } from "@/utils/utils";
import { getWeatherImageSource } from "@/utils/weatherImage";
import React, { useEffect } from "react";
import { FlatList, Image, Text, View } from "react-native";

interface DailyForecastPropsType {
  dailyForecastData: DailyWeatherType;
}

const DailyForecast = ({ dailyForecastData }: DailyForecastPropsType) => {
  useEffect(() => {
    console.log(dailyForecastData);
  }, [dailyForecastData]);

  if (!dailyForecastData) return;

  return (
    <View className="flex flex-col gap-5">
      <Text className="text-[22px] text-n0 font-dmSemiBold">
        Daily Forecast
      </Text>

      <FlatList
        data={dailyForecastData?.time}
        renderItem={({ item, index }) => (
          <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
            <Text className="text-2xl font-md text-n0">
              {isoToWeekday(item)}
            </Text>

            <Image
              source={getWeatherImageSource(
                dailyForecastData?.weather_code[index]
              )}
              className="w-20 h-20"
            />

            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-xl font-md text-n0">{`${dailyForecastData?.temperature_2m_min[index].toFixed(0)}\u00B0`}</Text>

              <Text className="text-xl font-md text-n0">{`${dailyForecastData?.temperature_2m_max[index].toFixed(0)}\u00B0`}</Text>
            </View>
          </View>
        )}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          marginBottom: 18,
        }}
      />
    </View>
  );
};

export default DailyForecast;
