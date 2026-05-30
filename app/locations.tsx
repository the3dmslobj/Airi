import { removeLocation } from "@/slices/savedLocationsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const C = { text: "#FFF1E8", rain: "#29ADFF", accent: "#FF004D" };

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
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex flex-row items-center gap-4 px-4 py-4">
        <TouchableOpacity hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={C.text} />
        </TouchableOpacity>
        <Text className="text-text text-base font-pixelBold uppercase">
          Saved Locations
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-4 gap-2 pt-2">
        {/* Device location, always available */}
        <TouchableOpacity
          className="flex flex-row items-center gap-3 bg-surface border-2 border-border px-4 py-4"
          onPress={() => goHome({ lat: "", lon: "", name: "", country: "" })}
        >
          <Ionicons name="navigate" size={22} color={C.rain} />
          <Text className="text-text text-xl font-term">My Location</Text>
        </TouchableOpacity>

        {savedItems.length === 0 ? (
          <Text className="text-textMuted text-xl font-term text-center px-6 py-8">
            No saved locations yet. Star a city from search to add it here.
          </Text>
        ) : (
          savedItems.map((item) => (
            <View
              key={item.id}
              className="flex flex-row items-center bg-surface border-2 border-border px-4 py-4"
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
                <Ionicons name="location-outline" size={22} color={C.text} />
                <Text className="text-text text-xl font-term">
                  {item.name + ", " + item.country}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                hitSlop={8}
                onPress={() => dispatch(removeLocation(item.id))}
              >
                <Ionicons name="trash-outline" size={22} color={C.accent} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
