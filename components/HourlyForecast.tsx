import DotMatrixWeather from "@/components/DotMatrixWeather";
import { HourlyWeatherType } from "@/interfaces/weather.interface";
import { RootState } from "@/store/store";
import { getCurrentWeekday } from "@/utils/currentDate";
import {
  filterHourlyByWeekday,
  WeekDayLongType,
  WEEKDAYS_LONG,
} from "@/utils/hourlyFilter";
import { convertTemp, isoToTime12h } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const C = { text: "#FFFFFF" };

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
    duration: 150,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start();

  useEffect(() => {
    if (!currentDate || !hourlyForecastData) return;

    const res = filterHourlyByWeekday(hourlyForecastData, currentDate);

    if (!res) return;

    setHourlyWeatherData(res);
  }, [currentDate, hourlyForecastData]);

  const { tempUnit } = useSelector((state: RootState) => state.units);

  return (
    <View className="flex flex-col gap-4 px-4 py-5 bg-surface border border-dotted border-line -mt-2">
      <View className="flex flex-row items-center justify-between w-full">
        <Text className="text-sm text-text font-dot uppercase">
          Hourly Forecast
        </Text>

        <View className="relative">
          <TouchableOpacity
            className="flex flex-row px-4 gap-3 items-center bg-surface2 border border-dotted border-line py-2"
            onPress={() => setIsDayDropDownOpen(!isDayDropDownOpen)}
          >
            <Text className="font-mono text-base text-text">
              {currentDate.split(", ")[0]}
            </Text>
            <Ionicons
              name={isDayDropDownOpen ? `chevron-up` : `chevron-down`}
              color={C.text}
              size={18}
            />
          </TouchableOpacity>

          <Animated.View
            className={`bg-surface border border-dotted border-line absolute top-14 flex flex-col gap-1 p-2 w-[190px] right-0 z-10`}
            style={{ opacity: daysOp }}
          >
            {WEEKDAYS_LONG.map((d, i) => (
              <TouchableOpacity
                className={`p-2.5 ${d === currentDate.split(", ")[0] ? "bg-surface2" : ""}`}
                key={i}
                onPress={() => {
                  setCurrentDate(d);
                  setIsDayDropDownOpen(false);
                }}
              >
                <Text className="font-mono text-base text-text">{d}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </View>

      <View className="flex flex-col gap-4">
        {hourlyWeatherData?.time?.map((t, i) => (
          <View
            key={i}
            className="flex flex-row items-center py-2.5 pl-3 pr-4 bg-surface2 border border-dotted border-line gap-3"
          >
            <DotMatrixWeather
              code={hourlyWeatherData?.weather_code[i]}
              size={40}
              animated={false}
            />
            <Text className="text-xl font-mono text-text">
              {isoToTime12h(t)}
            </Text>
            <Text className="ml-auto text-xl font-mono text-text">{`${convertTemp(Number(hourlyForecastData?.temperature_2m[i]), tempUnit)}°`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HourlyForecast;
