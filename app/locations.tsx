import { removeLocation } from "@/slices/savedLocationsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function Locations() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const savedItems = useSelector(
    (state: RootState) => state.savedLocations.items
  );

  // Return to the home screen, optionally switching the active city.
  function goHome(params?: Record<string, string | number>) {
    router.navigate({ pathname: "/", params: { query: "", ...params } });
  }

  return (
    <SafeAreaView className="flex-1 bg-n900">
      <View className="flex flex-row items-center gap-4 px-4 py-4">
        <TouchableOpacity hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={"white"} />
        </TouchableOpacity>
        <Text className="text-n0 text-3xl font-briBold">Saved Locations</Text>
      </View>

      <ScrollView contentContainerClassName="px-4 gap-2 pt-2">
        {/* Device location, always available */}
        <TouchableOpacity
          className="flex flex-row items-center gap-3 bg-n800 border-[1px] border-n600 rounded-xl px-4 py-4"
          onPress={() => goHome({ lat: "", lon: "", name: "", country: "" })}
        >
          <Ionicons name="navigate" size={22} color={"#3b82f6"} />
          <Text className="text-n0 text-xl font-dm">My Location</Text>
        </TouchableOpacity>

        {savedItems.length === 0 ? (
          <Text className="text-n200 text-lg font-dm text-center px-6 py-8">
            No saved locations yet. Star a city from search to add it here.
          </Text>
        ) : (
          savedItems.map((item) => (
            <View
              key={item.id}
              className="flex flex-row items-center bg-n800 border-[1px] border-n600 rounded-xl px-4 py-4"
            >
              <TouchableOpacity
                className="flex-1 flex flex-row items-center gap-3"
                onPress={() =>
                  goHome({
                    lat: item.latitude,
                    lon: item.longitude,
                    id: item.id,
                    name: item.name,
                    country: item.country,
                  })
                }
              >
                <Ionicons name="location-outline" size={22} color={"white"} />
                <Text className="text-n0 text-xl font-dm">
                  {item.name + ", " + item.country}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                hitSlop={8}
                onPress={() => dispatch(removeLocation(item.id))}
              >
                <Ionicons name="trash-outline" size={22} color={"#f87171"} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
