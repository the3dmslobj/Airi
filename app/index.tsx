import currentBg from "@/assets/images/current-bg.png";
import sunny from "@/assets/images/icon-sunny.webp";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
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
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);
  const [isDayDropDownOpen, setIsDayDropDownOpen] = useState<boolean>(false);

  const unitsOp = useRef(new Animated.Value(0)).current;
  const daysOp = useRef(new Animated.Value(0)).current;

  Animated.timing(unitsOp, {
    toValue: isUnitDropdownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  Animated.timing(daysOp, {
    toValue: isDayDropDownOpen ? 1 : 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  useEffect(() => {
    console.log(query);
  }, [query]);

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
          <ImageBackground
            source={currentBg}
            resizeMode="stretch"
            className="py-16 flex flex-col items-center gap-4 w-full"
          >
            <Text className="text-4xl font-dmBold text-n0">
              Berlin, Germany
            </Text>
            <Text className="text-2xl font-dm text-n200">
              Tuesday, Aug 5, 2025
            </Text>
            <View className="flex flex-row gap-5 items-center">
              <Image source={sunny} className="w-40 h-40" />
              <Text className="text-9xl font-dmSemiBoldItalic pt-10 pr-1 text-n0">{`30\u00B0`}</Text>
            </View>
          </ImageBackground>

          <View className="flex flex-col gap-7 flex-wrap">
            <View className="flex flex-row gap-7">
              <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
                <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
                <Text className="text-n0 text-4xl font-dmLight">{`18\u00B0`}</Text>
              </View>

              <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
                <Text className="text-n200 text-2xl font-dm">Humidity</Text>
                <Text className="text-n0 text-4xl font-dmLight">46%</Text>
              </View>
            </View>

            <View className="flex flex-row gap-7">
              <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
                <Text className="text-n200 text-2xl font-dm">Feels Like</Text>
                <Text className="text-n0 text-4xl font-dmLight">{`18\u00B0`}</Text>
              </View>

              <View className="p-5 bg-n800 flex flex-col gap-6 rounded-xl border-[1px] border-n600 flex-1">
                <Text className="text-n200 text-2xl font-dm">Humidity</Text>
                <Text className="text-n0 text-4xl font-dmLight">46%</Text>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-5">
            <Text className="text-[22px] text-n0 font-dmSemiBold">
              Daily Forecast
            </Text>

            <View className="flex flex-row justify-between">
              <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
                <Text className="text-2xl font-md text-n0">Tue</Text>
                <Image source={sunny} className="w-20 h-20" />
                <View className="flex flex-row justify-between items-center w-full">
                  <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
                  <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
                </View>
              </View>

              <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
                <Text className="text-2xl font-md text-n0">Tue</Text>
                <Image source={sunny} className="w-20 h-20" />
                <View className="flex flex-row justify-between items-center w-full">
                  <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
                  <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
                </View>
              </View>

              <View className="w-[30%] flex flex-col items-center bg-n800 py-4 px-2.5 gap-4 rounded-xl border-[1px] border-n600">
                <Text className="text-2xl font-md text-n0">Tue</Text>
                <Image source={sunny} className="w-20 h-20" />
                <View className="flex flex-row justify-between items-center w-full">
                  <Text className="text-xl font-md text-n0">{`18\u00B0`}</Text>
                  <Text className="text-xl font-md text-n0">{`25\u00B0`}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-4 px-4 py-5 bg-n800 rounded-xl">
            <View className="flex flex-row items-center justify-between w-full">
              <Text className="text-[22px] text-n0 font-dmSemiBold">
                Hourly Forecast
              </Text>

              <View className="relative">
                <TouchableOpacity
                  className="flex flex-row px-4 gap-3 items-center bg-n600 py-2 rounded-lg"
                  onPress={() => setIsDayDropDownOpen(!isDayDropDownOpen)}
                >
                  <Text className="font-dm text-xl text-n0">Tuesday</Text>
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
                  className="bg-n800 border-[1px] border-n600 absolute top-14 flex flex-col gap-1 p-2 rounded-xl w-[180px] right-0"
                  style={{ opacity: daysOp }}
                >
                  <TouchableOpacity className="p-2.5 bg-n700 rounded-lg">
                    <Text className="font-dm text-xl text-n0">Monday</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>

            <View className="flex flex-row gap-4">
              <View>
                <Text className="text-white">Hello</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
