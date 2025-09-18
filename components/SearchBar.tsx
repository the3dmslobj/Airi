import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  return (
    <View className="w-full flex flex-col gap-3 relative">
      <View className="flex flex-row items-center bg-n800 px-6 gap-4 rounded-xl">
        <Ionicons name="search-outline" color={"white"} size={22} />
        <TextInput
          placeholder="Search for a place..."
          className="text-n200 text-2xl py-4 font-dm"
          placeholderTextColor={"#d5d4d9"}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <TouchableOpacity
        className="w-full items-center justify-center py-4 bg-b500 rounded-xl"
        onPress={() => router.setParams({ query: searchQuery })}
      >
        <Text className="text-n0 text-2xl">Search</Text>
      </TouchableOpacity>

      <View className="flex flex-col bg-n800 absolute top-36 w-full rounded-xl mt-2 p-2 z-10 border-[1px] border-n700 gap-1">
        <TouchableOpacity className="px-2 py-2.5 bg-n700 rounded-lg border-[1px] border-n600">
          <Text className="text-xl font-dm text-n0">Hello</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-2 py-2.5 rounded-lg">
          <Text className="text-xl font-dm text-n0">Hello</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
