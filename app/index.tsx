// app/(tabs)/index.tsx
import { useEffect, useRef, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { StreamCard } from "../components/cards/StreamCard";
import { WeatherCard } from "../components/cards/WeatherCard";
import { TText } from "../components/ui/TText";
import {
    GPS_URL,
    OPENWEATHER_API_KEY,
    WEATHER_POLL_MS,
} from "../constants/config";
import { theme } from "../lib/theme";

type GpsResponse = {
  alt: number;
  lat: number;
  lon: number;
};

type Weather = {
  temperature: number;
  condition: string;
  location: string;
  altitude: number | null;
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
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather(initial: boolean) {
      try {
        if (initial) setWeatherLoading(true);

        const gpsRes = await fetch(GPS_URL);
        if (!gpsRes.ok) throw new Error(`GPS error: ${gpsRes.status}`);
        const gps: GpsResponse = await gpsRes.json();

        if (!OPENWEATHER_API_KEY) throw new Error("Missing OpenWeather key");

        const wxRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${gps.lat}&lon=${gps.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        if (!wxRes.ok) throw new Error(`Weather error: ${wxRes.status}`);

        const data = await wxRes.json();

        if (cancelled) return;

        const newWeather: Weather = {
          temperature: Math.round(data.main.temp),
          condition: poeticWeather(
            String(data.weather?.[0]?.description || "").toLowerCase()
          ),
          location: data.name || "Middle-earth",
          altitude: Number.isFinite(gps.alt) ? gps.alt : null,
        };

        // avoid extra re-renders
        if (JSON.stringify(newWeather) !== JSON.stringify(weather)) {
          setWeather(newWeather);
        }

        if (initial) {
          setWeatherLoading(false);
          hasLoadedOnce.current = true;
        }
      } catch (err) {
        console.log("Weather load failed", err);
        if (initial) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather(true);
    const id = setInterval(() => loadWeather(false), WEATHER_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [weather]);

  return (
    <ImageBackground
      source={require("../../assets/images/parchment-bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: theme.spacing.md }}>
          <TText variant="heading">Mount Zoom</TText>
          <TText variant="caption" muted>
            The Palantír of the road
          </TText>
        </View>

        <WeatherCard
          loading={weatherLoading}
          temperature={weather?.temperature}
          condition={weather?.condition}
          location={weather?.location}
          altitude={weather?.altitude ?? null}
        />

        <View style={{ height: theme.spacing.lg }} />

        <StreamCard />

        <View style={{ height: 40 }} />

        <View style={{ alignItems: "center" }}>
          <TText variant="caption" muted>
            2025 G&J Co • Powered by the One Ring • Fuelled by coffee
          </TText>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 80,
  },
});
