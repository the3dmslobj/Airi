import PixelWeather from "@/components/PixelWeather";
import { DailyWeatherType } from "@/interfaces/weather.interface";
import { RootState } from "@/store/store";
import { convertTemp, isoToWeekday } from "@/utils/utils";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface DailyForecastPropsType {
  dailyForecastData: DailyWeatherType;
}

const DailyForecast = ({ dailyForecastData }: DailyForecastPropsType) => {
  const { tempUnit } = useSelector((state: RootState) => state.units);

  if (!dailyForecastData) return;

  return (
    <View className="flex flex-col gap-5">
      <Text className="text-sm text-text font-pixel uppercase">
        Daily Forecast
      </Text>

      <FlatList
        data={dailyForecastData?.time}
        renderItem={({ item, index }) => (
          <View className="w-[30%] flex flex-col items-center bg-surface py-4 px-2.5 gap-3 border-2 border-border">
            <Text className="text-xs font-pixel uppercase text-text">
              {isoToWeekday(item)}
            </Text>

            <PixelWeather
              code={dailyForecastData?.weather_code[index]}
              size={56}
              animated={false}
            />

            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-xl font-term text-text">{`${convertTemp(Number(dailyForecastData?.temperature_2m_min[index]), tempUnit)}°`}</Text>

              <Text className="text-xl font-term text-text">{`${convertTemp(Number(dailyForecastData?.temperature_2m_max[index]), tempUnit)}°`}</Text>
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
