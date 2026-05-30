import CurrentWeather from "@/components/CurrentWeather";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { useCurrentLocation } from "@/services/location";
import { weatherQueryOptions } from "@/services/queryOptions";
import {
  precUnitToggle,
  tempUnitToggle,
  toImperial,
  toMetric,
  windUnitToggle,
} from "@/slices/unitSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";

export default function Index() {
  const { query, lat, lon } = useLocalSearchParams();

  const { location } = useCurrentLocation();

  const dispatch = useDispatch<AppDispatch>();

  // Searched city coords (from params) take priority over the device location.
  const effectiveLat = lat ? Number(lat) : location?.coords.latitude;
  const effectiveLon = lon ? Number(lon) : location?.coords.longitude;

  const {
    data: weather,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useQuery(weatherQueryOptions(effectiveLat, effectiveLon));

  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);

  const unitsOp = useRef(new Animated.Value(0)).current;

  Animated.timing(unitsOp, {
    toValue: isUnitDropdownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  const { tempUnit, windUnit, precUnit } = useSelector(
    (store: RootState) => store.units
  );

  const isAllImperial =
    tempUnit === "f" && windUnit === "mph" && precUnit === "in";

  return (
    <SafeAreaView className="flex-1 bg-n900">
      <ScrollView
        contentContainerClassName="px-4 gap-12"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#ffffff"
          />
        }
      >
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
              <TouchableOpacity
                onPress={() => {
                  if (!isAllImperial) {
                    dispatch(toImperial());
                  } else {
                    dispatch(toMetric());
                  }
                }}
              >
                <Text className="px-2 py-2.5 font-dm text-xl text-n0">
                  {isAllImperial ? "Switch to Metric" : "Switch to Imperial"}
                </Text>
              </TouchableOpacity>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Temperature
                </Text>

                <View className="flex flex-col gap-1 pb-0.5 border-b-[1px] border-n300/20">
                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${tempUnit === "c" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (tempUnit === "c") return;
                      dispatch(tempUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">
                      Celcius {`(\u00B0C)`}
                    </Text>
                    {tempUnit === "c" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${tempUnit === "f" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (tempUnit === "f") return;
                      dispatch(tempUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">
                      Fahrenheit {`(\u00B0F)`}
                    </Text>
                    {tempUnit === "f" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Wind Speed
                </Text>

                <View className="flex flex-col gap-1 pb-0.5 border-b-[1px] border-n300/20">
                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${windUnit === "kmh" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (windUnit === "kmh") return;
                      dispatch(windUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">km/h</Text>
                    {windUnit === "kmh" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${windUnit === "mph" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (windUnit === "mph") return;
                      dispatch(windUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">mph</Text>
                    {windUnit === "mph" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex flex-col gap-2">
                <Text className="pt-1.5 px-2 font-dm text-lg text-n200">
                  Precipitation
                </Text>

                <View className="flex flex-col gap-1">
                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${precUnit === "mm" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (precUnit === "mm") return;
                      dispatch(precUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">
                      Millimeters (mm)
                    </Text>
                    {precUnit === "mm" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`px-2 py-2.5 flex flex-row justify-between items-center ${precUnit === "in" && "bg-n700"} rounded-lg`}
                    onPress={() => {
                      if (precUnit === "in") return;
                      dispatch(precUnitToggle());
                    }}
                  >
                    <Text className="text-xl font-dm text-n0">Inches (in)</Text>
                    {precUnit === "in" && (
                      <Ionicons name="checkmark" size={20} color={"white"} />
                    )}
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

        {isError ? (
          <View className="bg-n800 border-[1px] border-n600 rounded-xl p-6 flex flex-col items-center gap-4">
            <Ionicons name="cloud-offline-outline" size={40} color={"white"} />
            <Text className="text-n0 text-2xl font-dmBold text-center">
              Something went wrong
            </Text>
            <Text className="text-n200 text-lg font-dm text-center">
              We couldn&apos;t load the weather. Check your connection and try
              again.
            </Text>
            <TouchableOpacity
              className="px-6 py-3 bg-b500 rounded-xl"
              onPress={() => refetch()}
            >
              <Text className="text-n0 text-xl font-dm">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading || !weather ? (
          <WeatherSkeleton />
        ) : (
          <View className="flex flex-col gap-8">
            <CurrentWeather
              currentWeatherData={weather.current}
              timezone={weather.timezone}
            />

            <DailyForecast dailyForecastData={weather.daily} />

            <HourlyForecast
              hourlyForecastData={weather.hourly}
              timezone={weather.timezone}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
