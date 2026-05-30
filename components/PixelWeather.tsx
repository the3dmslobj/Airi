import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// PICO-8 colors used by the pixel scenes.
const C = {
  sun: "#FFEC27",
  sunDark: "#FFA300",
  cloud: "#C2C3C7",
  cloudDark: "#83769C",
  rain: "#29ADFF",
  snow: "#FFF1E8",
  bolt: "#FFEC27",
  fog: "#83769C",
};

type Scene =
  | "sunny"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

function codeToScene(code: number): Scene {
  if (code === 0) return "sunny";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  return "partly";
}

// A single pixel block placed on a 16x16 grid (u = one grid unit).
function Px({
  u,
  x,
  y,
  w = 1,
  h = 1,
  color,
}: {
  u: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  color: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: x * u,
        top: y * u,
        width: w * u,
        height: h * u,
        backgroundColor: color,
      }}
    />
  );
}

// A pixel cloud body anchored around the lower-middle of the grid.
function Cloud({ u, color = C.cloud }: { u: number; color?: string }) {
  return (
    <>
      <Px u={u} x={5} y={5} w={5} h={2} color={color} />
      <Px u={u} x={3} y={7} w={10} h={3} color={color} />
      <Px u={u} x={2} y={8} w={2} h={2} color={color} />
      <Px u={u} x={12} y={8} w={2} h={2} color={color} />
    </>
  );
}

function SunnyScene({ u, animated }: { u: number; animated: boolean }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    spin.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.steps(8, false) }),
      -1,
      false
    );
  }, [animated, spin]);

  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  return (
    <>
      <Animated.View style={[{ position: "absolute", inset: 0 }, raysStyle]}>
        <Px u={u} x={7} y={1} w={2} h={2} color={C.sun} />
        <Px u={u} x={7} y={13} w={2} h={2} color={C.sun} />
        <Px u={u} x={1} y={7} w={2} h={2} color={C.sun} />
        <Px u={u} x={13} y={7} w={2} h={2} color={C.sun} />
        <Px u={u} x={3} y={3} w={2} h={2} color={C.sunDark} />
        <Px u={u} x={11} y={3} w={2} h={2} color={C.sunDark} />
        <Px u={u} x={3} y={11} w={2} h={2} color={C.sunDark} />
        <Px u={u} x={11} y={11} w={2} h={2} color={C.sunDark} />
      </Animated.View>
      <Px u={u} x={5} y={5} w={6} h={6} color={C.sun} />
      <Px u={u} x={6} y={4} w={4} h={8} color={C.sun} />
      <Px u={u} x={4} y={6} w={8} h={4} color={C.sun} />
    </>
  );
}

function PartlyScene({ u, animated }: { u: number; animated: boolean }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    spin.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.steps(8, false) }),
      -1,
      false
    );
  }, [animated, spin]);
  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  return (
    <>
      <Animated.View style={[{ position: "absolute", inset: 0 }, raysStyle]}>
        <Px u={u} x={4} y={0} w={2} h={2} color={C.sun} />
        <Px u={u} x={0} y={4} w={2} h={2} color={C.sun} />
        <Px u={u} x={9} y={0} w={1} h={2} color={C.sunDark} />
      </Animated.View>
      <Px u={u} x={3} y={2} w={4} h={4} color={C.sun} />
      <Cloud u={u} />
    </>
  );
}

function CloudyScene({ u }: { u: number }) {
  return (
    <>
      <Cloud u={u} color={C.cloudDark} />
      <Px u={u} x={4} y={4} w={6} h={2} color={C.cloud} />
      <Px u={u} x={3} y={6} w={10} h={1} color={C.cloud} />
    </>
  );
}

function FogScene({ u }: { u: number }) {
  return (
    <>
      <Px u={u} x={2} y={4} w={12} h={1} color={C.fog} />
      <Px u={u} x={3} y={7} w={11} h={1} color={C.cloud} />
      <Px u={u} x={2} y={10} w={12} h={1} color={C.fog} />
      <Px u={u} x={4} y={13} w={9} h={1} color={C.cloud} />
    </>
  );
}

// Falling drops/flakes shared by rain, drizzle and snow scenes.
function Drop({
  u,
  x,
  color,
  delay,
  h = 2,
  travel = 5,
  duration = 700,
  animated,
}: {
  u: number;
  x: number;
  color: string;
  delay: number;
  h?: number;
  travel?: number;
  duration?: number;
  animated: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.steps(travel, false) }),
        -1,
        false
      )
    );
  }, [animated, delay, duration, travel, t]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: t.value * travel * u }],
    opacity: t.value > 0.85 ? 0 : 1,
  }));

  return (
    <Animated.View
      style={[{ position: "absolute", left: x * u, top: 9 * u }, style]}
    >
      <View style={{ width: u, height: h * u, backgroundColor: color }} />
    </Animated.View>
  );
}

function RainScene({ u, animated }: { u: number; animated: boolean }) {
  return (
    <>
      <Cloud u={u} color={C.cloudDark} />
      <Drop u={u} x={4} color={C.rain} delay={0} animated={animated} />
      <Drop u={u} x={8} color={C.rain} delay={250} animated={animated} />
      <Drop u={u} x={11} color={C.rain} delay={500} animated={animated} />
    </>
  );
}

function DrizzleScene({ u, animated }: { u: number; animated: boolean }) {
  return (
    <>
      <Cloud u={u} />
      <Drop u={u} x={5} color={C.rain} delay={0} h={1} animated={animated} />
      <Drop u={u} x={10} color={C.rain} delay={350} h={1} animated={animated} />
    </>
  );
}

function SnowScene({ u, animated }: { u: number; animated: boolean }) {
  return (
    <>
      <Cloud u={u} color={C.cloud} />
      <Drop
        u={u}
        x={4}
        color={C.snow}
        delay={0}
        h={1}
        duration={1100}
        animated={animated}
      />
      <Drop
        u={u}
        x={8}
        color={C.snow}
        delay={400}
        h={1}
        duration={1100}
        animated={animated}
      />
      <Drop
        u={u}
        x={11}
        color={C.snow}
        delay={800}
        h={1}
        duration={1100}
        animated={animated}
      />
    </>
  );
}

function StormScene({ u, animated }: { u: number; animated: boolean }) {
  const flash = useSharedValue(1);
  useEffect(() => {
    if (!animated) return;
    flash.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.steps(1, false) }),
        withTiming(0.15, { duration: 120 }),
        withTiming(1, { duration: 120 })
      ),
      -1,
      false
    );
  }, [animated, flash]);
  const boltStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  return (
    <>
      <Cloud u={u} color={C.cloudDark} />
      <Animated.View style={[{ position: "absolute", inset: 0 }, boltStyle]}>
        <Px u={u} x={8} y={9} w={2} h={2} color={C.bolt} />
        <Px u={u} x={7} y={11} w={2} h={2} color={C.bolt} />
        <Px u={u} x={6} y={13} w={2} h={2} color={C.bolt} />
      </Animated.View>
    </>
  );
}

interface PixelWeatherProps {
  code: number;
  size: number;
  animated?: boolean;
  style?: ViewStyle;
}

/**
 * Renders a blocky 8-bit weather scene for an Open-Meteo weather code,
 * drawn from Views on a 16x16 grid and (optionally) animated with Reanimated.
 */
export default function PixelWeather({
  code,
  size,
  animated = true,
  style,
}: PixelWeatherProps) {
  const u = size / 16;
  const scene = codeToScene(code);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {scene === "sunny" && <SunnyScene u={u} animated={animated} />}
      {scene === "partly" && <PartlyScene u={u} animated={animated} />}
      {scene === "cloudy" && <CloudyScene u={u} />}
      {scene === "fog" && <FogScene u={u} />}
      {scene === "drizzle" && <DrizzleScene u={u} animated={animated} />}
      {scene === "rain" && <RainScene u={u} animated={animated} />}
      {scene === "snow" && <SnowScene u={u} animated={animated} />}
      {scene === "storm" && <StormScene u={u} animated={animated} />}
    </View>
  );
}
