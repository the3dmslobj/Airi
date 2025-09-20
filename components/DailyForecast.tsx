import { DailyWeatherType } from "@/interfaces/weather.interface";
import { RootState } from "@/store/store";
import { convertTemp, isoToWeekday } from "@/utils/utils";
import { getWeatherImageSource } from "@/utils/weatherImage";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface DailyForecastPropsType {
  dailyForecastData: DailyWeatherType;
}

const DailyForecast = ({ dailyForecastData }: DailyForecastPropsType) => {
  const { tempUnit, windUnit, precUnit } = useSelector(
    (state: RootState) => state.units
  );

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
              <Text className="text-xl font-md text-n0">{`${convertTemp(Number(dailyForecastData?.temperature_2m_min[index]), tempUnit)}\u00B0`}</Text>

              <Text className="text-xl font-md text-n0">{`${convertTemp(Number(dailyForecastData?.temperature_2m_max[index]), tempUnit)}\u00B0`}</Text>
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
