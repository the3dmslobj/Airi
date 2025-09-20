import CurrentWeather from "@/components/CurrentWeather";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import { WeatherResponse } from "@/interfaces/response.interface";
import { fetchWeatherData } from "@/services/api";
import { useCurrentLocation } from "@/services/location";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/SearchBar";

export default function Index() {
  const { query } = useLocalSearchParams();

  const { location, error } = useCurrentLocation();

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [timezone, setTimezone] = useState<string>("");

  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);

  const unitsOp = useRef(new Animated.Value(0)).current;

  Animated.timing(unitsOp, {
    toValue: isUnitDropdownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  useEffect(() => {
    console.log(query);
  }, [query]);

  useEffect(() => {
    async function getWeather() {
      if (!location) return;
      const weatherData = await fetchWeatherData(
        location?.coords.latitude,
        location?.coords.longitude
      );

      if (!weatherData) return;
      setWeather(weatherData);
    }

    getWeather();
  }, [location]);

  return (
    <SafeAreaView className="flex-1 bg-n900">
      <ScrollView contentContainerClassName="px-4 gap-12">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-n0 text-3xl font-briBold">Airi</Text>

          <View className="relative">
            <Pressable
              className="flex flex-row gap-2.5 items-center font-dm bg-n800 p-2.5 rounded-lg"
              onPress={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
            >
              <Ionicons name="settings-outline" color={"white"} size={20} />
              <Text className="text-white ">Units</Text>
              <Ionicons
                name={
                  isUnitDropdownOpen
                    ? `chevron-up-outline`
                    : `chevron-down-outline`
                }
                color={"white"}
                size={18}
              />
            </Pressable>

            <Animated.View
              className={`absolute top-14 right-0 px-2 py-1.5 flex flex-col w-[220px] bg-n800 border-[1px] border-n600 rounded-xl z-10 gap-1`}
              style={{ opacity: unitsOp }}
            >
              <Text className="px-2 py-2.5 font-dm text-xl text-n0">
                Switch to Imperial
              </Text>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Temperature
                </Text>

                <View className="flex flex-col gap-1 pb-0.5 border-b-[1px] border-n300/20">
                  <TouchableOpacity className="px-2 py-2.5 flex flex-row justify-between items-center bg-n700 rounded-lg">
                    <Text className="text-xl font-dm text-n0">
                      Celcius {`(\u00B0C)`}
                    </Text>
                    <Ionicons name="checkmark" size={20} color={"white"} />
                  </TouchableOpacity>
                  <TouchableOpacity className="px-2 py-2.5">
                    <Text className="text-xl font-dm text-n0">
                      Fahrenheit {`(\u00B0F)`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Wind Speed
                </Text>

                <View className="flex flex-col gap-1 pb-0.5 border-b-[1px] border-n300/20">
                  <TouchableOpacity className="px-2 py-2.5 flex flex-row justify-between items-center bg-n700 rounded-lg">
                    <Text className="text-xl font-dm text-n0">km/h</Text>
                    <Ionicons name="checkmark" size={20} color={"white"} />
                  </TouchableOpacity>
                  <TouchableOpacity className="px-2 py-2.5">
                    <Text className="text-xl font-dm text-n0">mph</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Precipitation
                </Text>

                <View className="flex flex-col gap-1">
                  <TouchableOpacity className="px-2 py-2.5 flex flex-row justify-between items-center bg-n700 rounded-lg">
                    <Text className="text-xl font-dm text-n0">
                      Millimeters (mm)
                    </Text>
                    <Ionicons name="checkmark" size={20} color={"white"} />
                  </TouchableOpacity>
                  <TouchableOpacity className="px-2 py-2.5">
                    <Text className="text-xl font-dm text-n0">Inches (in)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>

        <Text className="text-n0 text-7xl font-briBold text-center">
          How's the sky looking today?
        </Text>

        <SearchBar />

        <View className="flex flex-col gap-8">
          <CurrentWeather
            currentWeatherData={weather?.current!}
            timezone={weather?.timezone!}
          />

          <DailyForecast dailyForecastData={weather?.daily!} />

          <HourlyForecast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
