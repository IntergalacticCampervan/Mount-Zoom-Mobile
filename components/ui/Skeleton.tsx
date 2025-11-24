// components/ui/Skeleton.tsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { theme } from "../../lib/theme";

type Props = {
  height: number;
  width?: number | string;
  radius?: number;
};

export function Skeleton({ height, width = "100%", radius }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          height,
          width,
          opacity,
          borderRadius: radius ?? theme.radius.sm,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surfaceSoft,
  },
});
