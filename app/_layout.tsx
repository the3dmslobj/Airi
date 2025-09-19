import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore if the splash screen has already been prevented from auto hiding
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "bri-bold": require("../assets/fonts/Bricolage_Grotesque/BricolageGrotesque-Bold.ttf"),
    "dm-bold": require("../assets/fonts/DM_Sans/DMSans-Bold.ttf"),
    "dm-light": require("../assets/fonts/DM_Sans/DMSans-Light.ttf"),
    "dm-medium": require("../assets/fonts/DM_Sans/DMSans-Medium.ttf"),
    "dm-semi": require("../assets/fonts/DM_Sans/DMSans-SemiBold.ttf"),
    "dm-semiItalic": require("../assets/fonts/DM_Sans/DMSans-SemiBoldItalic.ttf"),
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

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
