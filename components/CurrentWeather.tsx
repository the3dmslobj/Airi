import currentBg from "@/assets/images/current-bg.png";
import { CurrentWeatherType } from "@/interfaces/weather.interface";
import { useCurrentLocation } from "@/services/location";
import { getCurrentDate } from "@/utils/currentDate";
import { getWeatherImageSource } from "@/utils/weatherImage";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";

interface CurrentWeatherPropsType {
  currentWeatherData: CurrentWeatherType;
  timezone: string;
}

const CurrentWeather = ({
  currentWeatherData,
  timezone,
}: CurrentWeatherPropsType) => {
  const { location, error } = useCurrentLocation();

  const [city, setCity] = useState<string>("");

  const [currentDate, setCurrentDate] = useState<string>("");

  /*
  useEffect(() => {
    async function setCityFunc() {
      if (!location) return;
      const res = await reverseGeocode(
        location?.coords.latitude,
        location?.coords.longitude
      );

      if (!res || res?.error) return;

      setCity(`${res.address?.city}, ${res.display_name.split(", ").at(-1)}`);
      console.log(res);
    }

    setCityFunc();
  }, [location]);
  */

  useEffect(() => {
    function setCurrentDateFunc() {
      const date = getCurrentDate(timezone);
      if (!date) return;
      setCurrentDate(date);
    }

    setCurrentDateFunc();
  }, [timezone]);

  return (
    <View className="flex flex-col gap-8">
      <ImageBackground
        source={currentBg}
        resizeMode="stretch"
        className="py-16 flex flex-col items-center gap-4 w-full"
      >
        <Text className="text-4xl font-dmBold text-n0">{city}</Text>
        <Text className="text-2xl font-dm text-n200">{currentDate}</Text>
        <View className="flex flex-row gap-5 items-center">
          <Image
            source={getWeatherImageSource(
              currentWeatherData?.weather_code as number
            )}
            className="w-40 h-40"
          />
          <Text className="text-9xl font-dmSemiBoldItalic pt-10 pr-1 text-n0">{`${currentWeatherData?.temperature_2m.toFixed(0)}\u00B0`}</Text>
        </View>
      </ImageBackground>

      <View className="flex flex-col gap-7 flex-wrap">
        <View className="flex flex-row gap-7">
          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
            <Text className="text-n0 text-4xl font-dmLight">{`${currentWeatherData?.apparent_temperature.toFixed(0)}\u00B0`}</Text>
          </View>

          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Humidity</Text>
            <Text className="text-n0 text-4xl font-dmLight">
              {currentWeatherData?.relative_humidity_2m}%
            </Text>
          </View>
        </View>

        <View className="flex flex-row gap-7">
          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Wind</Text>
            <Text className="text-n0 text-4xl font-dmLight">
              {currentWeatherData?.wind_speed_10m.toFixed(0)} km/h
            </Text>
          </View>

          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Precipitation</Text>
            <Text className="text-n0 text-4xl font-dmLight">
              {currentWeatherData?.precipitation} mm
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
