import {
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from "@expo-google-fonts/silkscreen";
import { VT323_400Regular } from "@expo-google-fonts/vt323";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { Provider } from "react-redux";

import store from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if the splash screen has already been prevented from auto hiding
});

// Created once at module scope so the cache persists across re-renders.
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
    VT323_400Regular,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </QueryClientProvider>
  );
}
