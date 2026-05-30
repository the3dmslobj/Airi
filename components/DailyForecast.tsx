import DotMatrixWeather from "@/components/DotMatrixWeather";
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
      <Text className="text-sm text-text font-dot uppercase">
        Daily Forecast
      </Text>

      <FlatList
        data={dailyForecastData?.time}
        renderItem={({ item, index }) => (
          <View className="w-[30%] flex flex-col items-center bg-surface py-4 px-2.5 gap-3 border border-dotted border-line">
            <Text className="text-[11px] font-dot uppercase text-textDim">
              {isoToWeekday(item)}
            </Text>

            <DotMatrixWeather
              code={dailyForecastData?.weather_code[index]}
              size={52}
              animated={false}
            />

            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-base font-mono text-text">{`${convertTemp(Number(dailyForecastData?.temperature_2m_min[index]), tempUnit)}°`}</Text>

              <Text className="text-base font-mono text-text">{`${convertTemp(Number(dailyForecastData?.temperature_2m_max[index]), tempUnit)}°`}</Text>
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
