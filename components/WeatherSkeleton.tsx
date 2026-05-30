import React from "react";
import { View } from "react-native";

// Placeholder blocks shown while the weather query is loading.
const Block = ({ className }: { className: string }) => (
  <View className={`bg-n800 rounded-xl ${className}`} />
);

const WeatherSkeleton = () => {
  return (
    <View className="flex flex-col gap-8">
      {/* Current weather hero */}
      <View className="py-16 flex flex-col items-center gap-4 w-full">
        <Block className="h-9 w-56" />
        <Block className="h-6 w-40" />
        <Block className="h-40 w-72 mt-2" />
      </View>

      {/* Detail tiles */}
      <View className="flex flex-col gap-7">
        <View className="flex flex-row gap-7">
          <Block className="flex-1 h-28" />
          <Block className="flex-1 h-28" />
        </View>
        <View className="flex flex-row gap-7">
          <Block className="flex-1 h-28" />
          <Block className="flex-1 h-28" />
        </View>
      </View>

      {/* Daily forecast row */}
      <View className="flex flex-row gap-3 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Block key={i} className="h-32 flex-1 min-w-[90px]" />
        ))}
      </View>
    </View>
  );
};

export default WeatherSkeleton;
