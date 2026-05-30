import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const COL = { on: "#FFFFFF", dim: "#8A8A8A" };
const GRID = 12;

type Cell = { x: number; y: number };

// Turn an ASCII bitmap (non-space char = dot) into dot coordinates.
function parse(rows: string[]): Cell[] {
  const cells: Cell[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== " ") cells.push({ x, y });
    }
  });
  return cells;
}

const CLOUD = parse([
  "            ",
  "            ",
  "            ",
  "    XXXX    ",
  "   XXXXXX   ",
  "  XXXXXXXX  ",
  " XXXXXXXXXX ",
  " XXXXXXXXXX ",
  "            ",
  "            ",
  "            ",
  "            ",
]);

const SUN_BODY = parse([
  "            ",
  "            ",
  "            ",
  "     XX     ",
  "    XXXX    ",
  "   XXXXXX   ",
  "   XXXXXX   ",
  "    XXXX    ",
  "     XX     ",
  "            ",
  "            ",
  "            ",
]);

const SUN_RAYS = parse([
  "            ",
  "     XX     ",
  "            ",
  "  X      X  ",
  "            ",
  "X          X",
  "X          X",
  "            ",
  "  X      X  ",
  "            ",
  "     XX     ",
  "            ",
]);

const SUN_SMALL = parse([
  " X          ",
  "XXX         ",
  " X          ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
]);

const RAIN = parse([
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "  X   X   X ",
  "  X   X   X ",
  "            ",
  "            ",
]);

const DRIZZLE = parse([
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "   X    X   ",
  "            ",
  "            ",
  "            ",
]);

const SNOW = parse([
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "  X   X   X ",
  "            ",
  "            ",
  "            ",
]);

const BOLT = parse([
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "            ",
  "     XX     ",
  "    XX      ",
  "   XXXX     ",
  "     XX     ",
  "    X       ",
]);

const FOG = parse([
  "            ",
  "            ",
  "            ",
  " X X X X X  ",
  "            ",
  "  X X X X X ",
  "            ",
  " X X X X X  ",
  "            ",
  "  X X X X X ",
  "            ",
  "            ",
]);

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

// A grid of dots. `cell` is the size of one grid square; dots are centered.
function Dots({
  cells,
  cell,
  color,
}: {
  cells: Cell[];
  cell: number;
  color: string;
}) {
  const d = cell * 0.72;
  const pad = (cell - d) / 2;
  return (
    <>
      {cells.map((c, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: c.x * cell + pad,
            top: c.y * cell + pad,
            width: d,
            height: d,
            borderRadius: d / 2,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

// Dots whose opacity pulses (sun rays, lightning bolt).
function BlinkDots({
  cells,
  cell,
  color,
  animated,
  flash = false,
}: {
  cells: Cell[];
  cell: number;
  color: string;
  animated: boolean;
  flash?: boolean;
}) {
  const o = useSharedValue(1);
  useEffect(() => {
    if (!animated) return;
    o.value = flash
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: 1000, easing: Easing.steps(1, false) }),
            withTiming(0.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
          ),
          -1,
          false
        )
      : withRepeat(withTiming(0.25, { duration: 700 }), -1, true);
  }, [animated, flash, o]);

  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[{ position: "absolute", inset: 0 }, style]}>
      <Dots cells={cells} cell={cell} color={color} />
    </Animated.View>
  );
}

// Dots that fall and loop (rain, drizzle, snow).
function FallDots({
  cells,
  cell,
  color,
  animated,
  duration,
}: {
  cells: Cell[];
  cell: number;
  color: string;
  animated: boolean;
  duration: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.steps(4, false) }),
      -1,
      false
    );
  }, [animated, duration, t]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: t.value * 3 * cell }],
    opacity: 1 - t.value * 0.7,
  }));
  return (
    <Animated.View style={[{ position: "absolute", inset: 0 }, style]}>
      <Dots cells={cells} cell={cell} color={color} />
    </Animated.View>
  );
}

interface DotMatrixWeatherProps {
  code: number;
  size: number;
  animated?: boolean;
  style?: ViewStyle;
}

/**
 * Renders a monochrome dot-matrix weather glyph for an Open-Meteo weather code
 * on a 12x12 grid, optionally animated (pulsing rays, falling rain, flashing bolt).
 */
export default function DotMatrixWeather({
  code,
  size,
  animated = true,
  style,
}: DotMatrixWeatherProps) {
  const cell = size / GRID;
  const scene = codeToScene(code);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {scene === "sunny" && (
        <>
          <Dots cells={SUN_BODY} cell={cell} color={COL.on} />
          <BlinkDots cells={SUN_RAYS} cell={cell} color={COL.on} animated={animated} />
        </>
      )}

      {scene === "partly" && (
        <>
          <Dots cells={CLOUD} cell={cell} color={COL.dim} />
          <BlinkDots cells={SUN_SMALL} cell={cell} color={COL.on} animated={animated} />
        </>
      )}

      {scene === "cloudy" && <Dots cells={CLOUD} cell={cell} color={COL.on} />}

      {scene === "fog" && <Dots cells={FOG} cell={cell} color={COL.dim} />}

      {scene === "drizzle" && (
        <>
          <Dots cells={CLOUD} cell={cell} color={COL.dim} />
          <FallDots
            cells={DRIZZLE}
            cell={cell}
            color={COL.on}
            animated={animated}
            duration={900}
          />
        </>
      )}

      {scene === "rain" && (
        <>
          <Dots cells={CLOUD} cell={cell} color={COL.dim} />
          <FallDots
            cells={RAIN}
            cell={cell}
            color={COL.on}
            animated={animated}
            duration={700}
          />
        </>
      )}

      {scene === "snow" && (
        <>
          <Dots cells={CLOUD} cell={cell} color={COL.dim} />
          <FallDots
            cells={SNOW}
            cell={cell}
            color={COL.on}
            animated={animated}
            duration={1400}
          />
        </>
      )}

      {scene === "storm" && (
        <>
          <Dots cells={CLOUD} cell={cell} color={COL.dim} />
          <BlinkDots
            cells={BOLT}
            cell={cell}
            color={COL.on}
            animated={animated}
            flash
          />
        </>
      )}
    </View>
  );
}
