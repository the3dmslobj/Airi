import currentBg from "@/assets/images/current-bg.png";
import { CurrentWeatherType } from "@/interfaces/weather.interface";
import { reverseGeocode } from "@/services/api";
import { useCurrentLocation } from "@/services/location";
import { RootState } from "@/store/store";
import { getCurrentDate } from "@/utils/currentDate";
import { convertPrec, convertTemp, convertWind } from "@/utils/utils";
import { getWeatherImageSource } from "@/utils/weatherImage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface CurrentWeatherPropsType {
  currentWeatherData: CurrentWeatherType;
  timezone: string;
}

const CurrentWeather = ({
  currentWeatherData,
  timezone,
}: CurrentWeatherPropsType) => {
  const { lat, lon } = useLocalSearchParams();
  const { location, error } = useCurrentLocation();

  const [city, setCity] = useState<string>("");

  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    async function setCityFunc() {
      if (lat && lon) {
        const res = await reverseGeocode(Number(lat), Number(lon));
        if (!res || res?.error) return;

        setCity(`${res.address?.city}, ${res.display_name.split(", ").at(-1)}`);
        return;
      }

      if (!location) return;
      const res = await reverseGeocode(
        location?.coords.latitude,
        location?.coords.longitude
      );

      if (!res || res?.error) return;

      setCity(`${res.address?.city}, ${res.display_name.split(", ").at(-1)}`);
    }

    setCityFunc();
  }, [location, lat, lon]);

  useEffect(() => {
    function setCurrentDateFunc() {
      const date = getCurrentDate(timezone);
      if (!date) return;
      setCurrentDate(date);
    }

    setCurrentDateFunc();
  }, [timezone]);

  const { tempUnit, windUnit, precUnit } = useSelector(
    (state: RootState) => state.units
  );

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
          <Text className="text-9xl font-dmSemiBoldItalic pt-10 pr-1 text-n0">{`${currentWeatherData ? convertTemp(Number(currentWeatherData?.temperature_2m), tempUnit) : "-"}\u00B0`}</Text>
        </View>
      </ImageBackground>

      <View className="flex flex-col gap-7 flex-wrap">
        <View className="flex flex-row gap-7">
          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
            <Text className="text-n0 text-4xl font-dmLight">{`${convertTemp(Number(currentWeatherData?.apparent_temperature), tempUnit)}\u00B0`}</Text>
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
              {convertWind(
                Number(currentWeatherData?.wind_speed_10m),
                windUnit
              )}{" "}
              {windUnit === "kmh" ? "km/h" : "mph"}
            </Text>
          </View>

          <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
            <Text className="text-n200 text-2xl font-dm">Precipitation</Text>
            <Text className="text-n0 text-4xl font-dmLight">
              {convertPrec(Number(currentWeatherData?.precipitation), precUnit)}{" "}
              {precUnit === "mm" ? "mm" : "in"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
