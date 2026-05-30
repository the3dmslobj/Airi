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
import { useLocalSearchParams, useRouter } from "expo-router";
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

// PICO-8 hex values for places that need raw colors (Ionicons, RefreshControl).
const C = {
  text: "#FFF1E8",
  sun: "#FFEC27",
  accent: "#FF004D",
};

export default function Index() {
  const { query, lat, lon } = useLocalSearchParams();
  const router = useRouter();

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
    duration: 150,
    easing: Easing.linear,
    useNativeDriver: true,
  }).start();

  const { tempUnit, windUnit, precUnit } = useSelector(
    (store: RootState) => store.units
  );

  const isAllImperial =
    tempUnit === "f" && windUnit === "mph" && precUnit === "in";

  // Shared classes for the pixel-styled unit option rows.
  const optionRow = (active: boolean) =>
    `px-2 py-2.5 flex flex-row justify-between items-center ${
      active ? "bg-surface2" : ""
    }`;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView
        contentContainerClassName="px-4 gap-12"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={C.text}
          />
        }
      >
        <View className="flex flex-row items-center justify-between">
          <Text className="text-text text-2xl font-pixelBold">AIRI</Text>

          <View className="flex flex-row items-center gap-2.5">
            <TouchableOpacity
              className="bg-surface border-2 border-border p-2.5"
              onPress={() => router.push("/locations")}
            >
              <Ionicons name="bookmark" color={C.text} size={20} />
            </TouchableOpacity>

            <View className="relative">
              <Pressable
                className="flex flex-row gap-2.5 items-center bg-surface border-2 border-border p-2.5"
                onPress={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
              >
                <Ionicons name="settings" color={C.text} size={20} />
                <Text className="text-text font-pixel text-[10px]">UNITS</Text>
                <Ionicons
                  name={isUnitDropdownOpen ? `chevron-up` : `chevron-down`}
                  color={C.text}
                  size={18}
                />
              </Pressable>

              <Animated.View
                className={`absolute top-16 right-0 px-2 py-1.5 flex flex-col w-[230px] bg-surface border-2 border-border z-10 gap-1`}
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
                  <Text className="px-2 py-2.5 font-term text-2xl text-text">
                    {isAllImperial ? "Switch to Metric" : "Switch to Imperial"}
                  </Text>
                </TouchableOpacity>

                <View className="flex flex-col gap-2">
                  <Text className="pt-1.5 px-2 font-pixel text-[10px] uppercase text-textMuted">
                    Temperature
                  </Text>

                  <View className="flex flex-col gap-1 pb-1 border-b-2 border-border">
                    <TouchableOpacity
                      className={optionRow(tempUnit === "c")}
                      onPress={() => {
                        if (tempUnit === "c") return;
                        dispatch(tempUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">
                        Celcius {`(°C)`}
                      </Text>
                      {tempUnit === "c" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={optionRow(tempUnit === "f")}
                      onPress={() => {
                        if (tempUnit === "f") return;
                        dispatch(tempUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">
                        Fahrenheit {`(°F)`}
                      </Text>
                      {tempUnit === "f" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex flex-col gap-2">
                  <Text className="pt-1.5 px-2 font-pixel text-[10px] uppercase text-textMuted">
                    Wind Speed
                  </Text>

                  <View className="flex flex-col gap-1 pb-1 border-b-2 border-border">
                    <TouchableOpacity
                      className={optionRow(windUnit === "kmh")}
                      onPress={() => {
                        if (windUnit === "kmh") return;
                        dispatch(windUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">km/h</Text>
                      {windUnit === "kmh" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={optionRow(windUnit === "mph")}
                      onPress={() => {
                        if (windUnit === "mph") return;
                        dispatch(windUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">mph</Text>
                      {windUnit === "mph" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex flex-col gap-2">
                  <Text className="pt-1.5 px-2 font-pixel text-[10px] uppercase text-textMuted">
                    Precipitation
                  </Text>

                  <View className="flex flex-col gap-1">
                    <TouchableOpacity
                      className={optionRow(precUnit === "mm")}
                      onPress={() => {
                        if (precUnit === "mm") return;
                        dispatch(precUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">
                        Millimeters (mm)
                      </Text>
                      {precUnit === "mm" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={optionRow(precUnit === "in")}
                      onPress={() => {
                        if (precUnit === "in") return;
                        dispatch(precUnitToggle());
                      }}
                    >
                      <Text className="text-2xl font-term text-text">
                        Inches (in)
                      </Text>
                      {precUnit === "in" && (
                        <Ionicons name="checkmark" size={20} color={C.sun} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>
        </View>

        <Text className="text-text text-base font-pixel text-center leading-7 uppercase">
          How&apos;s the sky looking today?
        </Text>

        <SearchBar />

        {isError ? (
          <View className="bg-surface border-2 border-border p-6 flex flex-col items-center gap-4">
            <Ionicons name="cloud-offline" size={40} color={C.accent} />
            <Text className="text-text text-sm font-pixelBold text-center">
              SOMETHING WENT WRONG
            </Text>
            <Text className="text-textDim text-xl font-term text-center">
              We couldn&apos;t load the weather. Check your connection and try
              again.
            </Text>
            <TouchableOpacity
              className="px-6 py-3 bg-accent border-2 border-text"
              onPress={() => refetch()}
            >
              <Text className="text-text text-xs font-pixel">RETRY</Text>
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
