// components/cards/WeatherCard.tsx
import { StyleSheet, View } from "react-native";
import { theme } from "../../lib/theme";
import { Skeleton } from "../ui/Skeleton";
import { TText } from "../ui/TText";

type Props = {
  loading: boolean;
  temperature?: number;
  condition?: string;
  location?: string;
  altitude?: number | null;
};

export function WeatherCard({
  loading,
  temperature,
  condition,
  location,
  altitude,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topStripe} />
      <View style={styles.inner}>
        <TText variant="subheading">Current Realm Weather</TText>

        {loading ? (
          <View style={{ marginTop: 12 }}>
            <Skeleton height={22} width={140} />
            <View style={{ height: 8 }} />
            <Skeleton height={18} width={200} />
          </View>
        ) : (
          <>
            <TText style={styles.temp}>
              {temperature != null ? `${temperature}°C` : "--°C"}
            </TText>
            <TText muted style={{ marginBottom: 4 }}>
              {condition ?? "Weather lost in the Misty Mountains"}
            </TText>
            <TText variant="caption" muted>
              {location ?? "Unknown land"}
              {altitude != null ? ` · ${Math.round(altitude)} m MSL` : ""}
            </TText>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.goldSoft,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  topStripe: {
    height: 5,
    backgroundColor: theme.colors.goldSoft,
  },
  inner: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  temp: {
    fontFamily: theme.fonts.heading,
    fontSize: 26,
    color: theme.colors.goldBright,
    marginTop: 6,
    marginBottom: 2,
  },
});
