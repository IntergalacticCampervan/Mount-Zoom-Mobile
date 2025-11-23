// app/(tabs)/index.tsx
import { GPS_URL, OPENWEATHER_API_KEY, STREAM_URL, theme } from "@/constants/config";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

type Weather = {
  temperature: number;
  condition: string;
  location: string;
  altitude: number | null;
};

type GpsResponse = {
  alt: number;
  lat: number;
  lon: number;
};

function poeticWeather(desc: string): string {
  const map: Record<string, string> = {
    clear: "Sunlight over the Shire",
    clouds: "Clouds over the Misty Mountains",
    rain: "Rain from the West",
    drizzle: "Drizzle in the Downs",
    thunderstorm: "Thunder from Mordor",
    snow: "Snowfall in Caradhras",
    mist: "Fog rolling in from the East",
  };

  const key = Object.keys(map).find((k) => desc.includes(k)) ?? "clear";
  return map[key];
}

export default function DashboardScreen() {
  const router = useRouter();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherFromGps();
  }, []);

  async function loadWeatherFromGps() {
    try {
      setLoadingWeather(true);

      // 1) Get GPS from the Pi
      const gpsRes = await fetch(GPS_URL);
      if (!gpsRes.ok) {
        throw new Error(`GPS error: ${gpsRes.status}`);
      }
      const gps: GpsResponse = await gpsRes.json();

      // 2) Call OpenWeather with that lat/lon
      if (!OPENWEATHER_API_KEY) {
        throw new Error("Missing OpenWeather API key");
      }

      const wxRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${gps.lat}&lon=${gps.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      if (!wxRes.ok) {
        throw new Error(`Weather error: ${wxRes.status}`);
      }
      console.log("WX URL:", `https://api.openweathermap.org/data/2.5/weather?lat=${gps.lat}&lon=${gps.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`);

      const data = await wxRes.json();

      setWeather({
        temperature: Math.round(data.main.temp),
        condition: poeticWeather(
          String(data.weather?.[0]?.description || "").toLowerCase()
        ),
        location: data.name || "Middle-earth",
        altitude: Number.isFinite(gps.alt) ? gps.alt : null,
      });
    } catch (err) {
      console.log("Weather load failed", err);
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("authToken"); // or whatever flag you store
    router.replace("/login");
  }

  return (
    <View style={styles.root}>
      {/* Header / weather bar */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mount Zoom</Text>

          {loadingWeather && (
            <Text style={styles.subtitle}>Summoning the beacons…</Text>
          )}

          {!loadingWeather && weather && (
            <>
              <Text style={styles.subtitle}>
                {weather.temperature}°C · {weather.condition}
              </Text>
              <Text style={styles.meta}>
                {weather.location}
                {weather.altitude != null
                  ? ` · ${Math.round(weather.altitude)} m MSL`
                  : ""}
              </Text>
            </>
          )}

          {!loadingWeather && !weather && (
            <Text style={styles.subtitle}>Weather lost in the Misty Mountains</Text>
          )}
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stream */}
      <View style={styles.streamCard}>
        {streamError && (
          <View style={styles.streamError}>
            <Text style={styles.streamErrorText}>
              Stream went missing on the road – trying to reconnect…
            </Text>
          </View>
        )}

        <WebView
          source={{ uri: STREAM_URL }}
          style={{ flex: 1, borderRadius: theme.radius.lg }}
          onError={(syntheticEvent) => {
            console.log("Stream error", syntheticEvent.nativeEvent);
            setStreamError("Stream error");
          }}
          onLoad={() => setStreamError(null)}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.accent,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.text,
    fontSize: 14,
  },
  meta: {
    marginTop: 2,
    color: theme.colors.muted,
    fontSize: 12,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginLeft: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.text,
    fontSize: 13,
  },
  streamCard: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  streamError: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: theme.colors.danger,
    padding: 6,
    borderRadius: theme.radius.md,
  },
  streamErrorText: {
    color: theme.colors.bg,
    fontSize: 12,
    textAlign: "center",
  },
});
