import { HourlyWeatherType } from "@/interfaces/weather.interface";
import { getCurrentWeekday } from "@/utils/currentDate";
import {
  filterHourlyByWeekday,
  WeekDayLongType,
  WEEKDAYS_LONG,
} from "@/utils/hourlyFilter";
import { isoToTime12h } from "@/utils/utils";
import { getWeatherImageSource } from "@/utils/weatherImage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HourlyForecastPropsType {
  hourlyForecastData: HourlyWeatherType;
  timezone: string;
}

const HourlyForecast = ({
  hourlyForecastData,
  timezone,
}: HourlyForecastPropsType) => {
  const [currentDate, setCurrentDate] = useState<WeekDayLongType>(() =>
    getCurrentWeekday(timezone)
  );

  const { lat, lon } = useLocalSearchParams();

  useEffect(() => {
    setCurrentDate(getCurrentWeekday(timezone));
  }, [lat, lon]);

  const [hourlyWeatherData, setHourlyWeatherData] = useState<
    HourlyWeatherType | undefined
  >(undefined);

  const [isDayDropDownOpen, setIsDayDropDownOpen] = useState<boolean>(false);
  const daysOp = useRef(new Animated.Value(0)).current;

  Animated.timing(daysOp, {
    toValue: isDayDropDownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  useEffect(() => {
    if (!currentDate || !hourlyForecastData) return;

    const res = filterHourlyByWeekday(hourlyForecastData, currentDate);

    if (!res) return;

    setHourlyWeatherData(res);
  }, [currentDate, hourlyForecastData]);

  /*
  useEffect(() => {
    function setCurrentDateFunc() {
      const date = getCurrentDate(timezone);
      if (!date) return;
      setCurrentDate(date);
    }

    setCurrentDateFunc();
  }, [timezone]);
  */

  return (
    <View className="flex flex-col gap-4 px-4 py-5 bg-n800 rounded-xl -mt-2">
      <View className="flex flex-row items-center justify-between w-full">
        <Text className="text-[22px] text-n0 font-dmSemiBold">
          Hourly Forecast
        </Text>

        <View className="relative">
          <TouchableOpacity
            className="flex flex-row px-4 gap-3 items-center bg-n600 py-2 rounded-lg"
            onPress={() => setIsDayDropDownOpen(!isDayDropDownOpen)}
          >
            <Text className="font-dm text-xl text-n0">
              {currentDate.split(", ")[0]}
            </Text>
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
            className={`bg-n800 border-[1px] border-n600 absolute top-14 flex flex-col gap-1 p-2 rounded-xl w-[180px] right-0 z-10`}
            style={{ opacity: daysOp }}
          >
            {WEEKDAYS_LONG.map((d, i) => (
              <TouchableOpacity
                className={`p-2.5 ${d === currentDate.split(", ")[0] ? "bg-n700" : ""} rounded-lg`}
                key={i}
                onPress={() => {
                  setCurrentDate(d);
                  setIsDayDropDownOpen(false);
                }}
              >
                <Text className="font-dm text-xl text-n0">{d}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </View>

      <View className="flex flex-col gap-4">
        {hourlyWeatherData?.time?.map((t, i) => (
          <View
            key={i}
            className="flex flex-row items-center py-2.5 pl-3 pr-4 bg-n700 rounded-lg border-[1px] border-n600 gap-2"
          >
            <Image
              source={getWeatherImageSource(hourlyWeatherData?.weather_code[i])}
              className="w-16 h-16"
            />
            <Text className="text-2xl font-dm text-n0">{isoToTime12h(t)}</Text>
            <Text className="ml-auto text-2xl font-dm text-n0">{`${hourlyWeatherData?.temperature_2m[i].toFixed(0)}\u00B0`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HourlyForecast;
