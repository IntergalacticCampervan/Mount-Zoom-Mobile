// app/(tabs)/map.tsx
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { TText } from "../../components/ui/TText";
import { GPS_POLL_MS, GPS_URL } from "../../constants/config";
import { theme } from "../../lib/theme";

type Position = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  useEffect(() => {
    fetchPosition();
    const id = setInterval(fetchPosition, GPS_POLL_MS);
    return () => clearInterval(id);
  }, []);

  async function fetchPosition() {
    try {
      setLoading(true);
      const res = await fetch(GPS_URL);
      if (!res.ok) throw new Error(`GPS error: ${res.status}`);
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
        <TText variant="subheading">Seeking the beacons…</TText>
        {loading && <TText muted>Awaiting position from Mount Zoom</TText>}
      </View>
    );
  }

  const region: Region = {
    latitude: position.latitude,
    longitude: position.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0],
  });

  return (
    <View style={styles.root}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region}>
        <Marker coordinate={position}>
          <View style={styles.markerWrapper}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
            <Image
              source={require("../../assets/images/eye-marker.png")}
              style={styles.eye}
            />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  eye: {
    width: 32,
    height: 32,
  },
  pulseRing: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: theme.colors.goldSoft,
  },
});
