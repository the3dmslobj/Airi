import { CityResult } from "@/interfaces/city.interface";
import { geocodeCityQueryOptions } from "@/services/queryOptions";
import { addLocation, removeLocation } from "@/slices/savedLocationsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const SearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const savedItems = useSelector(
    (state: RootState) => state.savedLocations.items
  );
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const { query } = useLocalSearchParams();

  const [cities, setCitites] = useState<CityResult[] | null | undefined>([]);

  const { data, isPending } = useQuery(
    geocodeCityQueryOptions(query as string)
  );

  useEffect(() => {
    setCitites(data);
  }, [query, data]);

  return (
    <View className="w-full flex flex-col gap-3 relative">
      <View className="flex flex-row items-center bg-n800 px-6 gap-4 rounded-xl">
        <Ionicons name="search-outline" color={"white"} size={22} />
        <TextInput
          placeholder="Search for a place..."
          className="text-n200 text-2xl py-4 font-dm"
          placeholderTextColor={"#d5d4d9"}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery as string}
        />
        {searchQuery?.trim() && (
          <TouchableOpacity
            className="ml-auto"
            onPress={() => {
              setSearchQuery("");
              router.setParams({ query: "" });
            }}
          >
            <Ionicons name="close-outline" color={"white"} size={22} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        className="w-full items-center justify-center py-4 bg-b500 rounded-xl"
        onPress={() => router.setParams({ query: searchQuery })}
      >
        <Text className="text-n0 text-2xl">Search</Text>
      </TouchableOpacity>

      {String(query)?.trim() && query !== undefined && (
        <View className="flex flex-col bg-n800 absolute top-36 w-full rounded-xl mt-2 p-2 z-10 border-[1px] border-n700 gap-1">
          {!isPending ? (
            cities?.length !== 0 ? (
              cities?.map((city) => {
                const isSaved = savedItems.some((item) => item.id === city.id);

                return (
                  <View
                    key={city.id}
                    className="flex flex-row items-center px-2 py-2.5 rounded-lg gap-2"
                  >
                    <TouchableOpacity
                      className="flex-1"
                      onPress={() => {
                        router.setParams({
                          lat: city.latitude,
                          lon: city.longitude,
                          name: city.name,
                          country: city.country,
                          query: "",
                        });
                        setSearchQuery("");
                      }}
                    >
                      <Text className="text-xl font-dm text-n0">
                        {city?.name + ", " + city?.country}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      hitSlop={8}
                      onPress={() => {
                        if (isSaved) {
                          dispatch(removeLocation(city.id));
                        } else {
                          dispatch(
                            addLocation({
                              id: city.id,
                              name: city.name,
                              country: city.country,
                              latitude: city.latitude,
                              longitude: city.longitude,
                            })
                          );
                        }
                      }}
                    >
                      <Ionicons
                        name={isSaved ? "star" : "star-outline"}
                        size={22}
                        color={isSaved ? "#facc15" : "white"}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <Text className="text-n0 text-center font-dmBold text-xl py-2.5">
                Sorry, we can't find the city.
              </Text>
            )
          ) : (
            <ActivityIndicator size={"small"} />
          )}
        </View>
      )}
    </View>
  );
};

export default SearchBar;
