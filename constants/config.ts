// constants/config.ts
export const MOUNT_ZOOM_BASE = "https://mountzoom.hylton.co.nz";

// Raw MJPEG stream on the Pi
export const STREAM_URL = `${MOUNT_ZOOM_BASE}/?action=stream`;

// GPS endpoint on the Pi
export const GPS_URL = `${MOUNT_ZOOM_BASE}/gps/location`;

// OpenWeatherMap – use your real key here
export const OPENWEATHER_API_KEY = "299fbf95adcf65d403987fbec5b80a23";

export const GPS_POLL_MS = 10_000; // 10 seconds

export const WEATHER_POLL_MS = 15 * 60_000; // 15 minutes

export const theme = {
  colors: {
    bg: "#05060A",
    surface: "#0B0F19",
    accent: "#e4c35a",
    accentSoft: "rgba(228,195,90,0.2)",
    text: "#F9FAFB",
    muted: "#9CA3AF",
    border: "#1F2933",
    danger: "#F97373",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999,
  },
};
