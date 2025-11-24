// lib/theme.ts
export const theme = {
  colors: {
    bg: "#050507",
    surface: "rgba(8, 8, 10, 0.85)",
    surfaceSoft: "rgba(12, 12, 16, 0.85)",
    gold: "#d4b24b",
    goldBright: "#f4d47c",
    goldSoft: "rgba(244,212,124,0.25)",
    text: "#F5E6C8",
    textMuted: "#C2B79C",
    border: "rgba(255,255,255,0.08)",
    danger: "#F87171",
  },
  radius: {
    sm: 10,
    md: 18, // slightly angular card corners
    lg: 24,
    xl: 30,
    round: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fonts: {
    heading: "Ringbearer",
    body: "UncialAntiqua",
  },
};

export const textShadow = {
  textShadowColor: "rgba(0,0,0,0.9)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 4,
};
