// app/(tabs)/map.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { GPS_URL, theme } from "../../constants/config";

type Position = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosition();
    const id = setInterval(fetchPosition, 10_000); // match your web behaviour
    return () => clearInterval(id);
  }, []);

  async function fetchPosition() {
    try {
      setLoading(true);
      const res = await fetch(GPS_URL);
      if (!res.ok) {
        throw new Error(`GPS error: ${res.status}`);
      }
      const data = await res.json();
      setPosition({ latitude: data.lat, longitude: data.lon });
    } catch (err) {
      console.log("GPS fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  if (!position) {
    return (
      <View style={styles.center}>
        {loading ? (
          <>
            <ActivityIndicator />
            <Text style={styles.centerText}>Seeking the beacons…</Text>
          </>
        ) : (
          <Text style={styles.centerText}>No position from Mount Zoom</Text>
        )}
      </View>
    );
  }

  const region: Region = {
    latitude: position.latitude,
    longitude: position.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region}>
        <Marker coordinate={position} title="Mount Zoom" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    marginTop: 8,
    color: theme.colors.text,
  },
});
