// app/(tabs)/index.tsx
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StreamCard } from "../../components/cards/StreamCard";
import { WeatherCard } from "../../components/cards/WeatherCard";
import { TText } from "../../components/ui/TText";
import {
    GPS_URL,
    OPENWEATHER_API_KEY,
    WEATHER_POLL_MS,
} from "../../constants/config";
import { theme } from "../../lib/theme";

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

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        setWeatherLoading(true);
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
        if (!cancelled) setWeather(null);
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    }

    loadWeather();
    const id = setInterval(loadWeather, WEATHER_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg }}
    >
      <View>
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

      <StreamCard />

      {/* Placeholder for future InfoCard(s) */}
      {/* <InfoCard ... /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});
