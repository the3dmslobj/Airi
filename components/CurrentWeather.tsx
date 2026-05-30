import DotMatrixWeather from "@/components/DotMatrixWeather";
import { CurrentWeatherType } from "@/interfaces/weather.interface";
import { reverseGeocode } from "@/services/api";
import { useCurrentLocation } from "@/services/location";
import { addLocation, removeLocation } from "@/slices/savedLocationsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getCurrentDate } from "@/utils/currentDate";
import { convertPrec, convertTemp, convertWind } from "@/utils/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const C = { text: "#FFFFFF" };

interface CurrentWeatherPropsType {
  currentWeatherData: CurrentWeatherType;
  timezone: string;
}

const CurrentWeather = ({
  currentWeatherData,
  timezone,
}: CurrentWeatherPropsType) => {
  const { lat, lon, id, name, country } = useLocalSearchParams();
  const { location } = useCurrentLocation();

  const dispatch = useDispatch<AppDispatch>();
  const savedItems = useSelector(
    (state: RootState) => state.savedLocations.items
  );

  // A searched city carries id/name/country params; the device location does not.
  const searchedId = id ? Number(id) : null;
  const isSearchedCity =
    searchedId !== null &&
    Number.isFinite(searchedId) &&
    Boolean(lat) &&
    Boolean(lon);
  const isSaved =
    isSearchedCity && savedItems.some((item) => item.id === searchedId);

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

  const DetailCard = ({ label, value }: { label: string; value: string }) => (
    <View className="p-5 bg-surface border border-dotted border-line flex flex-col gap-3 flex-1">
      <Text className="text-textDim text-[11px] font-dot uppercase">
        {label}
      </Text>
      <Text className="text-text text-3xl font-mono">{value}</Text>
    </View>
  );

  return (
    <View className="flex flex-col gap-8">
      <View className="bg-surface border border-dotted border-line py-10 flex flex-col items-center gap-4 w-full">
        <View className="flex flex-row items-center gap-2 px-4">
          <Text className="text-base font-monoBold text-text text-center">
            {city}
          </Text>
          {isSearchedCity && (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => {
                if (isSaved) {
                  dispatch(removeLocation(searchedId as number));
                } else {
                  dispatch(
                    addLocation({
                      id: searchedId as number,
                      name: String(name ?? ""),
                      country: String(country ?? ""),
                      latitude: Number(lat),
                      longitude: Number(lon),
                    })
                  );
                }
              }}
            >
              <Ionicons
                name={isSaved ? "star" : "star-outline"}
                size={24}
                color={C.text}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-sm font-mono text-textDim">{currentDate}</Text>
        <View className="flex flex-row gap-4 items-center">
          <DotMatrixWeather
            code={currentWeatherData?.weather_code as number}
            size={120}
            animated
          />
          <Text className="text-8xl font-dot text-text">{`${currentWeatherData ? convertTemp(Number(currentWeatherData?.temperature_2m), tempUnit) : "-"}°`}</Text>
        </View>
      </View>

      <View className="flex flex-col gap-7 flex-wrap">
        <View className="flex flex-row gap-7">
          <DetailCard
            label="Feels Like"
            value={`${convertTemp(Number(currentWeatherData?.apparent_temperature), tempUnit)}°`}
          />
          <DetailCard
            label="Humidity"
            value={`${currentWeatherData?.relative_humidity_2m}%`}
          />
        </View>

        <View className="flex flex-row gap-7">
          <DetailCard
            label="Wind"
            value={`${convertWind(Number(currentWeatherData?.wind_speed_10m), windUnit)} ${windUnit === "kmh" ? "km/h" : "mph"}`}
          />
          <DetailCard
            label="Precipitation"
            value={`${convertPrec(Number(currentWeatherData?.precipitation), precUnit)} ${precUnit === "mm" ? "mm" : "in"}`}
          />
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
