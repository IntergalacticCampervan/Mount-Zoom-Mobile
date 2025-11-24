// components/cards/StreamCard.tsx
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { STREAM_URL } from "../../constants/config";
import { theme } from "../../lib/theme";
import { FullscreenModal } from "../ui/FullscreenModal";
import { TButton } from "../ui/TButton";
import { TText } from "../ui/TText";

export function StreamCard() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TText variant="subheading">Palantír Stream</TText>
          <TButton
            label="Fullscreen"
            variant="ghost"
            onPress={() => setFullscreen(true)}
          />
        </View>

        <View style={styles.streamFrame}>
          <WebView
            source={{ uri: STREAM_URL }}
            style={{ flex: 1 }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <View style={styles.footerRow}>
          <TText variant="caption" muted>
            Live from Mount Zoom
          </TText>
        </View>
      </View>

      <FullscreenModal visible={fullscreen} onClose={() => setFullscreen(false)}>
        <View style={styles.fullscreenHeader}>
          <TText variant="subheading" onPress={() => setFullscreen(false)}>
            × Close
          </TText>
        </View>
        <View style={styles.fullscreenStream}>
          <WebView
            source={{ uri: STREAM_URL }}
            style={{ flex: 1 }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </FullscreenModal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  streamFrame: {
    height: 230,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  footerRow: {
    marginTop: theme.spacing.sm,
  },
  fullscreenHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 8,
    paddingBottom: 6,
  },
  fullscreenStream: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
});
